from flask import Blueprint, request
import json
import mariadb

import mysql.connector
database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

removeQuestion_blueprint = Blueprint('removeQuestion_blueprint', __name__)

@removeQuestion_blueprint.route('/removeQuestion', methods=['GET', 'POST'])
def removeQuestion():
    req_data = request.get_json()
    authkey = req_data['authkey']
    qid = req_data['qid']

    # Ensure that authkey belongs to admin account.
    cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
    uid = cursor.fetchone()[0]
    cursor.execute('SELECT admin FROM users WHERE uid=%s' % uid)
    isAdmin = cursor.fetchone()[0]

    if isAdmin == 1:
        cursor.execute('SELECT type FROM questions WHERE qid=%s' % qid)
        qType = cursor.fetchone()[0]
        # First delete any questions from their individual tables before deleting from questions table.
        if qType == 0:
            cursor.execute('DELETE FROM sa_questions WHERE qid=%s' % qid)
        if qType == 1 or 2:
            cursor.execute('DELETE FROM mc_questions WHERE qid=%s' % qid)
        if qType == 3:
            cursor.execute('DELETE FROM scale_questions WHERE qid=%s' % qid)
        if qType == 4:
            cursor.execute('DELETE FROM ranking_questions WHERE qid=%s' % qid)
            
        cursor.execute('DELETE FROM questions WHERE qid=%s' % qid)
        database.commit()
        return {'status': 'success'}
    else:
        return {'status': 'fail'}
