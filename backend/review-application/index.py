import json
import os
import socket
import struct
import psycopg2

ADMIN_PASSWORD = "amethorn2026"


def rcon_command(host: str, port: int, password: str, command: str) -> str:
    """Отправка RCON команды на Minecraft сервер"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(10)
    sock.connect((host, port))

    def send_packet(req_id: int, ptype: int, payload: str):
        encoded = payload.encode('utf-8') + b'\x00\x00'
        length = 4 + 4 + len(encoded)
        packet = struct.pack('<iii', length, req_id, ptype) + encoded
        sock.sendall(packet)

    def recv_packet():
        raw_len = sock.recv(4)
        length = struct.unpack('<i', raw_len)[0]
        data = b''
        while len(data) < length:
            data += sock.recv(length - len(data))
        req_id = struct.unpack('<i', data[0:4])[0]
        ptype = struct.unpack('<i', data[4:8])[0]
        payload = data[8:-2].decode('utf-8', errors='replace')
        return req_id, ptype, payload

    send_packet(1, 3, password)
    recv_packet()

    send_packet(2, 2, command)
    _, _, response = recv_packet()
    sock.close()
    return response


def handler(event: dict, context) -> dict:
    """Одобрение или отклонение заявки на вступление в сервер Amethorn"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}

    headers = event.get('headers') or {}
    token = headers.get('X-Admin-Token') or headers.get('x-admin-token') or ''
    if token != ADMIN_PASSWORD:
        return {'statusCode': 403, 'headers': cors, 'body': json.dumps({'error': 'Forbidden'})}

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Invalid JSON'})}

    app_id = body.get('id')
    action = body.get('action')
    reject_reason = (body.get('reject_reason') or '').strip()

    if not app_id or action not in ('approve', 'reject'):
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Укажи id и action (approve/reject)'})}

    if action == 'reject' and not reject_reason:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Укажи причину отклонения'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute("SELECT id, minecraft_nick, status FROM applications WHERE id = %s", (app_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return {'statusCode': 404, 'headers': cors, 'body': json.dumps({'error': 'Заявка не найдена'})}

    if row[2] != 'pending':
        conn.close()
        return {'statusCode': 409, 'headers': cors, 'body': json.dumps({'error': 'Заявка уже рассмотрена'})}

    nick = row[1]

    if action == 'approve':
        rcon_host = os.environ.get('RCON_HOST', '')
        rcon_port = int(os.environ.get('RCON_PORT', '25575'))
        rcon_password = os.environ.get('RCON_PASSWORD', '')

        try:
            rcon_command(rcon_host, rcon_port, rcon_password, f'whitelist add {nick}')
        except Exception as e:
            conn.close()
            return {'statusCode': 500, 'headers': cors, 'body': json.dumps({'error': f'RCON ошибка: {str(e)}'})}

        cur.execute(
            "UPDATE applications SET status = 'approved', reviewed_at = NOW() WHERE id = %s",
            (app_id,)
        )
    else:
        cur.execute(
            "UPDATE applications SET status = 'rejected', reviewed_at = NOW(), reject_reason = %s WHERE id = %s",
            (reject_reason, app_id)
        )

    conn.commit()
    conn.close()

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'ok': True, 'nick': nick, 'action': action})
    }
