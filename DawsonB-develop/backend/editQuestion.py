from flask import Blueprint, request
import json
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

editQuestion_blueprint = Blueprint('editQuestion_blueprint', __name__)

@editQuestion_blueprint.route('/editQuestion', methods=['POST'])
def editQuestion():
    req_Data = request.get_json()
    authkey = req_Data['authkey']
    qid = req_Data['qid']
    type_new = req_Data['type']
    title = req_Data['title']
    disabled = req_Data['disabled']
    extra_sa = req_Data['extra_sa']
    deleted = req_Data['deleted']
    max_score = req_Data['max_score']
    min_score = req_Data['min_score']
    domain = req_Data['domain']
    subquestions = req_Data['subquestions']

    # Ensure that authkey belongs to admin account.
    cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
    uid = cursor.fetchone()[0]
    cursor.execute('SELECT admin FROM users WHERE uid=%s' % uid)
    isAdmin = cursor.fetchone()[0]
    if isAdmin != 1:
        #Return null qid if user accessing endpoint isn't an admin.
        return {'qid': 'NULL'}

    else:
        # Get current question information for that qid in database.
        cursor.execute('SELECT type FROM questions WHERE qid = %s' % qid)
        qType = cursor.fetchone()[0]
        # Delete previous sub-questions for that qid in their sub tables before adding new ones.
        if qType == 4:
            cursor.execute('DELETE FROM ranking_questions WHERE qid=%s' % qid)
            # Insert new question info for that question.
            x = 0
            for item in subquestions:
                text = item['text']
                weight = item['weight']
                sql = 'INSERT INTO ranking_questions (qid, subid, text, weight) VALUES (%s, %s, "%s", %s)'
                cursor.execute(sql % (qid, x, text, weight))
                x += 1

        if qType == 3:
            cursor.execute('DELETE FROM scale_questions WHERE qid=%s' % qid)
            for item in subquestions:
                scale = item['scale']
                note = item['note']
                weight = item['weight']
                cursor.execute('INSERT INTO scale_questions (qid, scale, note, weight) VALUES (%s, %s, "%s", %s)' % (qid, scale, note, weight))

        if qType == 2 or qType == 1:
            cursor.execute('DELETE FROM mc_questions WHERE qid=%s' % qid)
            x = 0
            for item in subquestions:
                text = item['text']
                weight = item['weight']
                sql = 'INSERT INTO mc_questions (qid, subid, text, weight) VALUES (%s, %s, "%s", %s)'
                cursor.execute(sql % (qid, x, text, weight))
                x += 1
            
        if qType == 0:
            cursor.execute('DELETE FROM sa_questions WHERE qid=%s' % qid)
            x = 0
            for item in subquestions:
                text = item
                sql = 'INSERT INTO sa_questions (qid, subid, text) VALUES (%s, %s, "%s")'
                cursor.execute(sql % (qid, x, text))
                x += 1
        
        # Before checking/inserting new sa_questions based on extra_sa, remove all previous entries for that qid.
        if qType != 0:
            cursor.execute('DELETE FROM sa_questions WHERE qid=%s' % qid)
        
        if extra_sa == 1:
            sa_text = req_Data['extra']
            cursor.execute('SELECT MAX(subid) FROM sa_questions WHERE qid = %s' % qid)
            subIds = cursor.fetchone()[0]
            x = 0
            if subIds is not None:
                x = subIds + 1
            sql = 'INSERT INTO sa_questions (qid, subid, text) VALUES (%s, %s, "%s")'
            cursor.execute(sql % (qid, x, sa_text))

        # Modify question in question attribute.
        sql = "UPDATE questions SET title='%s', type=%s, disabled=%s, extra_sa=%s, deleted=%s, max_score=%s, min_score=%s, domain=%s WHERE qid=%s"
        cursor.execute(sql % (title, type_new, disabled, extra_sa, deleted, max_score, min_score, domain, qid))
        
        # Commit changes to database.
        database.commit()
        
        return {'qid': qid}
