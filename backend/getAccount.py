from flask import Blueprint, request
import json
import string
import random
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

getAccount_blueprint = Blueprint('getAccount_blueprint', __name__)

# Return user account information for a given authkey (from users table).

@getAccount_blueprint.route('/getAccount', methods=['POST'])
def accountInfo():
    if request.method == 'POST':
        # Get authkey from frontend.
        req_data = request.get_json()
        authkey = req_data['authkey']

        # Get UID from authkey.
        cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
        uid = cursor.fetchone()

        # Get account information for given UID.
        cursor.execute('SELECT email, first_name, last_name, date_created, last_login, client, admin FROM users WHERE uid=%s' % uid)
        info = cursor.fetchall()[0]

        # Get account preferences (app settings) for given UID.
        cursor.execute('SELECT circle_colors, circle_rank, notify_time, avatar FROM preferences WHERE uid=%s' % uid)
        settings = cursor.fetchall()[0]

        # Create data structure to send information to server.
        return {'email': info[0], 'first_name': info[1], 'last_name': info[2],
                'date_created': info[3], 'last_login': info[4],
                'isClient': info[5], 'isAdmin': info[6], 'circle_colors': settings[0],
                'circle_rank': settings[1], 'notify_time': settings[2], 'avatar': settings[3]}
