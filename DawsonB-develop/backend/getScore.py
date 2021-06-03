from flask import Blueprint, request, jsonify
import mariadb
import string
import json
import random
from numpy import interp
from mariadb import Error

database = mariadb.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

getScore_blueprint = Blueprint('getScore_blueprint', __name__)

@getScore_blueprint.route('/getScore', methods=['POST'])
def getScore():
    if request.method == 'POST':
        req_data = request.get_json()
        authkey = req_data['authkey']
        scores = []

        # get uid
        cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
        uid = cursor.fetchone()

        # get user's latest sid
        cursor.execute('SELECT sid FROM surveys WHERE uid=%s ORDER BY sid DESC LIMIT 1', uid)
        sid = cursor.fetchone()
        if (sid is not None):
          sid = sid[0]
        else:
          return {"error": "No surveys"}

        # loop for each domain
        try:
          for i in range(0, 5):
            domainScores = []

            # Multiple Choice Radio #
            cursor.execute("""
              SELECT A.answer, Q.max_score, Q.min_score
              FROM surveys S
              JOIN answers A ON (S.sid = A.sid)
              JOIN questions Q ON (A.qid = Q.qid AND Q.type = 1)
              WHERE S.sid = ? AND Q.domain = ?
            """, (sid, i+1))
            mcr = cursor.fetchall()

            cursor.execute("""
            SELECT GROUP_CONCAT(MCQ.weight SEPARATOR ',')
            FROM questions Q
            JOIN mc_questions MCQ on (Q.qid = MCQ.qid)
            WHERE Q.domain = ? AND Q.type = 1
            GROUP BY Q.qid
            ORDER BY MCQ.subid ASC
            """, (i+1,))
            mcrWeights = cursor.fetchall()

            for idx, q in enumerate(mcr):
              answer = json.loads(q[0])[0]
              if (type(answer) != str):
                weights = mcrWeights[idx][0].split(',')
                domainScores.append(interp(weights[answer], [q[2], q[1]], [-1, 1]))
            #####

            # Multiple Choice Checkbox #
            cursor.execute("""
              SELECT A.answer, Q.max_score, Q.min_score
              FROM surveys S
              JOIN answers A ON (S.sid = A.sid)
              JOIN questions Q ON (A.qid = Q.qid AND Q.type = 2)
              WHERE S.sid = ? AND Q.domain = ?
            """, (sid, i+1))
            mcc = cursor.fetchall()
            
            cursor.execute("""
            SELECT GROUP_CONCAT(MCQ.weight SEPARATOR ',')
            FROM questions Q
            JOIN mc_questions MCQ on (Q.qid = MCQ.qid)
            WHERE Q.domain = ? AND Q.type = 2
            GROUP BY Q.qid
            ORDER BY MCQ.subid ASC
            """, (i+1,))
            mccWeights = cursor.fetchall()
            for idx, q in enumerate(mcc):
              weights = mccWeights[idx][0].split(',')
              total = 0
              for a in json.loads(q[0]):
                if (type(a) != str):
                  total += int(weights[a])
              domainScores.append(interp(total, [q[2], q[1]], [-1, 1]))
            #####

            # Scale #
            cursor.execute("""
              SELECT A.answer, Q.max_score, Q.min_score
              FROM surveys S
              JOIN answers A ON (S.sid = A.sid)
              JOIN questions Q ON (A.qid = Q.qid AND Q.type = 3)
              WHERE S.sid = ? AND Q.domain = ?
            """, (sid, i+1))
            scale = cursor.fetchall()
            
            for q in scale:
              answer = json.loads(q[0])[0]
              if (type(answer) != str):
                domainScores.append(interp(answer, [q[2], q[1]], [-1, 1]))
            #####

            # Ranking #
            cursor.execute("""
              SELECT A.answer, Q.max_score, Q.min_score
              FROM surveys S
              JOIN answers A ON (S.sid = A.sid)
              JOIN questions Q ON (A.qid = Q.qid AND Q.type = 4)
              WHERE S.sid = ? AND Q.domain = ?
            """, (sid, i+1))
            ranking = cursor.fetchall()

            cursor.execute("""
            SELECT GROUP_CONCAT(RQ.weight SEPARATOR ',')
            FROM questions Q
            JOIN ranking_questions RQ on (Q.qid = RQ.qid)
            WHERE Q.domain = ? AND Q.type = 4
            GROUP BY Q.qid
            ORDER BY RQ.subid ASC
            """, (i+1,))
            rankingWeights = cursor.fetchall()
            for idx, q in enumerate(ranking):
              weights = rankingWeights[idx][0].split(',')
              total = 0
              for idx2, a in enumerate(json.loads(q[0])):
                if (type(a) != str):
                  total += int(weights[a]) * (len(weights)-1-idx2)
              domainScores.append(interp(total, [q[2], q[1]], [-1, 1]))
            #####
            
            # calculate and save total score for this domain
            count = len(mcr) + len(mcc) + len(scale) + len(ranking)
            if (count > 0):
              scores.append(int(100 * (sum(domainScores)/count/2 + 0.5))) # turn into a whole percentage (no decimal, 0 - 100)
              #print(i+1, domainScores)
              #print(str(i) + ": " + str(sum(domainScores)/count/2 + 0.5), flush=True)
            else:
              scores.append(0.5) # default score, 50%
        except Error as e:
          print(e, flush=True)

        database.commit()
        return jsonify(scores)
