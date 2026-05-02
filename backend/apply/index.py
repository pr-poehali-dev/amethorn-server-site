import json
import os
import psycopg2

def handler(event: dict, context) -> dict:
    """Подача заявки на вступление в сервер Amethorn"""
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}

    try:
        body = json.loads(event.get('body') or '{}')
    except Exception:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Invalid JSON'})}

    nick = (body.get('minecraft_nick') or '').strip()
    age = body.get('age')
    about = (body.get('about') or '').strip()

    if not nick or not age or not about:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Заполни все поля'})}

    if len(nick) < 3 or len(nick) > 16:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Ник должен быть от 3 до 16 символов'})}

    try:
        age = int(age)
    except Exception:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Некорректный возраст'})}

    if age < 8 or age > 99:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Некорректный возраст'})}

    if len(about) < 20:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Расскажи о себе подробнее (минимум 20 символов)'})}

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute("SELECT id FROM applications WHERE minecraft_nick = %s AND status = 'pending'", (nick,))
    if cur.fetchone():
        conn.close()
        return {'statusCode': 409, 'headers': cors, 'body': json.dumps({'error': 'Заявка с этим ником уже на рассмотрении'})}

    cur.execute("SELECT id FROM applications WHERE minecraft_nick = %s AND status = 'approved'", (nick,))
    if cur.fetchone():
        conn.close()
        return {'statusCode': 409, 'headers': cors, 'body': json.dumps({'error': 'Этот ник уже в whitelist сервера'})}

    cur.execute(
        "INSERT INTO applications (minecraft_nick, age, about) VALUES (%s, %s, %s) RETURNING id",
        (nick, age, about)
    )
    app_id = cur.fetchone()[0]
    conn.commit()
    conn.close()

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'ok': True, 'id': app_id, 'message': 'Заявка отправлена! Ожидай решения.'})
    }
