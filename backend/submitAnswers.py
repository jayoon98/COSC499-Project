from flask import Blueprint, request
import string
import sys
import traceback
import json
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

submitAnswers_blueprint = Blueprint('submitAnswers_blueprint', __name__)

@submitAnswers_blueprint.route('/submitAnswers', methods=['POST'])
def submitAnswers():
    if request.method == 'POST':
        req_data = request.get_json()
        answers = req_data['answers']
        authKey = req_data['authkey']

        try:
            # get uid
            cursor.execute('SELECT uid FROM auth WHERE authkey = "%s"' % authKey)
            uid = cursor.fetchone()

            if uid == None: return "Invalid authkey", 500

            # create entry in `surveys` table
            cursor.execute("INSERT INTO surveys (uid) VALUES (%s)" % (uid))

            # get this new entry's sid
            cursor.execute("SELECT sid FROM surveys WHERE uid = %s ORDER BY sid DESC LIMIT 1" % (uid))
            sid = cursor.fetchone()[0]

            for a in answers:
                query = "INSERT INTO answers (sid, qid, answer) VALUES (%s, %s, '%s')"
                cursor.execute(query % (sid, a['qid'], json.dumps(a['answer'])))

            # commit changes to db
            database.commit()
            return { "message": "OK", "status": 200 }
        except:
        	# rollback changes to db
            database.rollback()
            print("submitAnswers - Error: " + str(sys.exc_info()[0]) + " | " + traceback.format_exc())
            return { "message": "Error: " + str(sys.exc_info()[0]) + " | " + traceback.format_exc(), "status": 500 }
    else:
        return { "message": "Method not allowed", "status": 405 }
