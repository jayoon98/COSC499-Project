from flask import Blueprint, request
import json
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

setClient_blueprint = Blueprint('setClient_blueprint', __name__)

@setClient_blueprint.route('/setClient', methods=['POST'])
def setClient():
    req_Data = request.get_json()
    authkey = req_Data['authkey'] # authkey for admin account making the change
    uid = req_Data['uid'] # uid to change client status for
    makeClient = req_Data['makeClient'] # false = remove client, true = make client

    # Ensure that authkey belongs to admin account
    cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
    adminUID = cursor.fetchone()[0]
    cursor.execute('SELECT admin FROM users WHERE uid=%s' % adminUID)
    isAdmin = cursor.fetchone()[0]

    if isAdmin == 1:
        cursor.execute('UPDATE users SET client = %s WHERE uid = "%s"' % (makeClient, uid))
        database.commit()
        return {'status': 'success'}
    else:
        return {'status': 'fail'}
    
