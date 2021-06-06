from flask import Blueprint, request
import json
import mariadb
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

disableQuestion_blueprint = Blueprint('disableQuestion_blueprint', __name__)

@disableQuestion_blueprint.route('/disableQuestion', methods=['POST'])
def disableQuestion():
    req_data = request.get_json()
    authkey = req_data['authkey']
    qid = req_data['qid']

    # Ensure that authkey belongs to admin account.
    cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
    uid = cursor.fetchone()[0]
    cursor.execute('SELECT admin FROM users WHERE uid=%s' % uid)
    isAdmin = cursor.fetchone()[0]
    if isAdmin == 1:
        cursor.execute('UPDATE questions SET disabled = 1 WHERE qid=%s' % qid)
        database.commit()
        return {'status': 'success'}
    else: 
        return {'status': 'fail'}
