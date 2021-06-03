from flask import Blueprint, request
import json
import string
import random
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

getUsers_blueprint = Blueprint('getUsers_blueprint', __name__)

@getUsers_blueprint.route('/getUsers', methods=['POST'])
def getUsers():
    req_data = request.get_json()
    authkey = req_data['authkey']
    
    # Ensure that authkey belongs to admin account.
    cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
    uid = cursor.fetchone()[0]
    cursor.execute('SELECT admin FROM users WHERE uid=%s' % uid)
    isAdmin = cursor.fetchone()[0]
    if isAdmin == 1:
        cursor.execute('SELECT uid, email, client, admin FROM users')
        data = cursor.fetchall()
        database.commit()
        return {'users': data}
    else: 
        return {'users': None}
