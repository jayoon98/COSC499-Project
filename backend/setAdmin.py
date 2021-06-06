from flask import Blueprint, request
import json
import mariadb
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

setAdmin_blueprint = Blueprint('setAdmin_blueprint', __name__)

@setAdmin_blueprint.route('/setAdmin', methods=['POST'])
def setAdmin():
    req_Data = request.get_json()
    authkey = req_Data['authkey'] # authkey for admin account making the change.
    uid = req_Data['uid'] # uid to change admin status for.
    makeAdmin = req_Data['makeAdmin'] # false = remove admin, true = make admin.

    # Ensure that authkey belongs to admin account.
    cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
    adminUID = cursor.fetchone()[0]
    cursor.execute('SELECT admin FROM users WHERE uid=%s' % adminUID)
    isAdmin = cursor.fetchone()[0]

    if isAdmin == 1 and uid != adminUID:
        cursor.execute('UPDATE users SET admin = %s WHERE uid = "%s"' % (makeAdmin, uid))
        database.commit()
        return {'status': 'success'}
    else:
        return {'status': 'fail'}
    
