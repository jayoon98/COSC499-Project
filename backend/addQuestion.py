from flask import Blueprint, request
import json
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

addQuestion_blueprint = Blueprint('addQuestion_blueprint', __name__)

@addQuestion_blueprint.route('/addQuestion', methods=['POST'])
def addQuestion():
    req_Data = request.get_json()
    authkey = req_Data['authkey']
    questions = req_Data['questions']
    qids = []

    # Ensure that authkey belongs to admin account.
    cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
    uid = cursor.fetchone()[0]
    cursor.execute('SELECT admin FROM users WHERE uid=%s' % uid)
    isAdmin = cursor.fetchone()[0]
    if isAdmin != 1:
        # Return null qid if user accessing endpoint isn't an admin.
        return {'qid': 'NULL'}
    else:
        # For each question in questions[].
        for question in questions:
            # Get question attributes.
            title = question['title']
            q_type = question['type']
            extra_sa = question['extra_sa']
            disabled = question['disabled']
            deleted = question['deleted']
            max_score = question['max_score']
            min_score = question['min_score']
            domain = question['domain']
            subquestions = question['subquestions']

            # Insert question into question table.
            sql = 'INSERT INTO questions (title, type, extra_sa, deleted, disabled, max_score, min_score, domain) VALUES ("%s", %s, %s, %s, %s, %s, %s, %s)'
            cursor.execute(sql % (title, q_type, extra_sa, deleted, disabled, max_score, min_score, domain))

            # Get qid for question that was just inserted.
            cursor.execute('SELECT max(qid) FROM questions')
            qid = cursor.fetchall()[0][0]
            qids.append(qid)

            # Determine question type. Then insert question into it's appropriate question table.
            
            # Short Answer Questions (Type 0)
            if q_type == 0:
                x = 0
                for item in subquestions:
                    text = item
                    cursor.execute('SELECT MAX(subid) FROM sa_questions WHERE qid = %s' % qid)
                    subIds = cursor.fetchone()[0]

                    sql = 'INSERT INTO sa_questions (qid, subid, text) VALUES (%s, %s, "%s")'
                    if subIds is None:
                        cursor.execute(sql % (qid, x, text))
                    else:
                        x = subIds + 1
                        cursor.execute(sql % (qid, x, text))
                    x += 1
            
            # MCC / MCR Questions. (Type 1 & 2)
            if q_type == 1 or q_type == 2:
                x = 0
                for item in subquestions:
                    text = item['text']
                    weight = item['weight']
                    cursor.execute('SELECT MAX(subid) FROM mc_questions WHERE qid = %s' % qid)
                    subIds = cursor.fetchone()[0]

                    sql = 'INSERT INTO mc_questions (qid, subid, text, weight) VALUES (%s, %s, "%s", %s)'
                    if subIds is None:
                        cursor.execute(sql % (qid, x, text, weight))
                    else:
                        x = subIds + 1
                        cursor.execute(sql % (qid, x, text, weight))
                    x += 1

            # Scale Questions (Type 3)
            if q_type == 3:
                for item in subquestions:
                    scale = item['scale']
                    note = item['note']
                    weight = item['weight']
                    cursor.execute('INSERT INTO scale_questions (qid, scale, note, weight) VALUES (%s, %s, "%s", %s)' % (qid, scale, note, weight))
                
            # Ranking Questions. (Type 4)
            if q_type == 4:
                x = 0
                for item in subquestions:
                    text = item['text']
                    weight = item['weight']
                    cursor.execute('SELECT MAX(subid) FROM ranking_questions WHERE qid = %s' % qid)
                    subIds = cursor.fetchone()[0]

                    # If first entry for that qid, than start with subid = 0.
                    sql = 'INSERT INTO ranking_questions (qid, subid, text, weight) VALUES (%s, %s, "%s", %s)'
                    if subIds is None:
                        cursor.execute(sql % (qid, x, text, weight))

                    # Else, insert subid as current + 1 for that qid.
                    else:
                        cursor.execute(sql % (qid, x, text, weight))
                    x += 1

            if extra_sa == 1:
                extra = question['extra']
                cursor.execute('SELECT MAX(subid) FROM sa_questions WHERE qid = %s' % qid)
                subIds = cursor.fetchone()[0]
                x = 0
                sql = 'INSERT INTO sa_questions (qid, subid, text) VALUES (%s, %s, "%s")'
                if subIds is None:
                    cursor.execute(sql % (qid, x, extra))
                else:
                    x = subIds + 1
                    cursor.execute(sql % (qid, x, extra))
                x += 1

        # Commit changes to database.
        database.commit()

        return {'qids': qids}    
