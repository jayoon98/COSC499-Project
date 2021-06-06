from flask import Blueprint, request
import json
import mysql.connector

# Manually define cursor for each script (otherwise it causes a byte index array error)
database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

getQuestions_blueprint = Blueprint('getQuestions_blueprint', __name__)

@getQuestions_blueprint.route('/getQuestions', methods=['GET', 'POST'])
def getQuestions():
    req_data = request.get_json()
    getDisabled = req_data['getDisabled']

    # List containing dictionary values for each question in db.
    questions = []

    # Fetch questions from database
    if (getDisabled):
        cursor.execute('SELECT qid, type, title, extra_sa, disabled, deleted, min_score, max_score, domain FROM questions WHERE deleted = 0')
    else:
        cursor.execute('SELECT qid, type, title, extra_sa, disabled, deleted, min_score, max_score, domain FROM questions WHERE deleted = 0 AND disabled = 0')

    result = cursor.fetchall()

    # Extract information for each question.
    for data in result:
        qid = data[0]
        type = data[1]
        title = data[2]
        extra_sa = data[3]
        disabled = True if data[4] == 1 else False
        deleted = True if data[5] == 1 else False
        min_score = data[6]
        max_score = data[7]
        domain = data[8]

        # Get subQuestions for each question.
        subQuestions = []

        # List containing extra subQs for select questions.
        extra = ''

        # List containing any extra subQuestions for each question if extra_sa is 1.

        # Short answer questions.
        if type == 0:
            if extra_sa == 1:
                cursor.execute('SELECT text FROM sa_questions WHERE qid=%s ORDER BY subid DESC OFFSET 1')
                fetch = cursor.fetchall()
                for x in fetch:
                    subQuestions.append(x[0])
                cursor.execute('SELECT text FROM sa_questions WHERE qid=%s ORDER BY subid DESC Limit 1')
                fetch = cursor.fetchone()[0]
                extra = fetch

            else:
                cursor.execute('SELECT text FROM sa_questions WHERE qid=%s ORDER BY subid ASC' % qid)
                result2 = cursor.fetchall()
                for x in result2:
                    subQuestions.append(x[0])

        # Multiple choice radio questions.
        elif type == 1:
            cursor.execute('SELECT text, weight FROM mc_questions WHERE qid=%s ORDER BY subid ASC' % qid)
            result2 = cursor.fetchall()
            for x in result2:
                subQuestions.append({ 'text': x[0], 'weight': x[1] })

            if extra_sa == 1:
                cursor.execute('SELECT text FROM sa_questions WHERE subid = 0 AND qid = %s' % qid)
                fetch = cursor.fetchone()[0]
                extra = fetch

        # Multiple choice checkbox questions.
        elif type == 2:
            cursor.execute('SELECT text, weight FROM mc_questions WHERE qid=%s ORDER BY subid ASC' % qid)
            result2 = cursor.fetchall()
            for x in result2:
                subQuestions.append({ 'text': x[0], 'weight': x[1] })

            if extra_sa == 1:
                cursor.execute('SELECT text FROM sa_questions WHERE subid = 0 AND qid = %s' % qid)
                fetch = cursor.fetchone()[0]
                extra = fetch

        # Scale questions.
        elif type == 3:
            cursor.execute('SELECT scale, note, weight FROM scale_questions WHERE qid=%s' % qid)
            result2 = cursor.fetchall()
            for x in result2:
                subQuestions.append({'scale': x[0], 'note': x[1], 'weight': x[2]})

            if extra_sa == 1:
                cursor.execute('SELECT text FROM sa_questions WHERE subid = 0 AND qid = %s' % qid)
                fetch = cursor.fetchone()[0]
                extra = fetch

        # Ranking questions.
        elif type == 4:
            cursor.execute('SELECT text, weight FROM ranking_questions WHERE qid=%s ORDER BY subid ASC' % qid)
            result2 = cursor.fetchall()
            for x in result2:
                subQuestions.append({ 'text': x[0], 'weight': x[1] })

            if extra_sa == 1:
                cursor.execute('SELECT text FROM sa_questions WHERE subid = 0 AND qid = %s' % qid)
                fetch = cursor.fetchone()[0]
                extra = fetch

        # Only include extra field if it isn't empty.
        if extra != '':
            question = {'qid': qid, 'type': type, 'title': title, 'subquestions': subQuestions, 'disabled': disabled, 'deleted': deleted, 'min_score': min_score, 'max_score': max_score, 'domain': domain, 'extra_sa': True, 'extra': extra}
            questions.append(question)
        else:
            question = {'qid': qid, 'type': type, 'title': title, 'subquestions': subQuestions, 'disabled': disabled, 'deleted': deleted, 'min_score': min_score, 'max_score': max_score, 'domain': domain, 'extra_sa': False}
            questions.append(question)

    database.commit()

    return json.dumps({'questions': questions})
