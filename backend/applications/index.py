import json
import os
import psycopg2

ADMIN_PASSWORD = "amethorn2026"

def handler(event: dict, context) -> dict:
    """Получение списка заявок (только для админов)"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    headers = event.get('headers') or {}
    token = headers.get('X-Admin-Token') or headers.get('x-admin-token') or ''
    if token != ADMIN_PASSWORD:
        return {'statusCode': 403, 'headers': cors, 'body': json.dumps({'error': 'Forbidden'})}

    params = event.get('queryStringParameters') or {}
    status_filter = params.get('status', 'all')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if status_filter == 'all':
        cur.execute(
            "SELECT id, minecraft_nick, age, about, status, created_at, reviewed_at, reject_reason "
            "FROM applications ORDER BY created_at DESC"
        )
    else:
        cur.execute(
            "SELECT id, minecraft_nick, age, about, status, created_at, reviewed_at, reject_reason "
            "FROM applications WHERE status = %s ORDER BY created_at DESC",
            (status_filter,)
        )

    rows = cur.fetchall()
    conn.close()

    apps = []
    for r in rows:
        apps.append({
            'id': r[0],
            'minecraft_nick': r[1],
            'age': r[2],
            'about': r[3],
            'status': r[4],
            'created_at': r[5].strftime('%d.%m.%Y %H:%M') if r[5] else None,
            'reviewed_at': r[6].strftime('%d.%m.%Y %H:%M') if r[6] else None,
            'reject_reason': r[7],
        })

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'applications': apps})
    }
