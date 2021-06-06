from flask import Blueprint, request
import json
import string
import random
import argon2
from datetime import datetime
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

auth_blueprint = Blueprint('auth_blueprint', __name__)

# Sign user out of their account from database.
@auth_blueprint.route('/signout', methods=['POST'])
def signOut():
    # Get parameters from frontend.
    req_data = request.get_json()
    authkey = req_data['authkey']

    # Delete uid from auth table where authkey exists.
    cursor.execute('DELETE FROM auth WHERE authkey="%s"' % authkey)

    # Variable indicating the status of the user's login. (False = Logged out, True = Logged in)
    validLogin = False

    # Commit changes to database.
    database.commit()

    # Return false, indicating that the user has been logged out.
    return {'login': validLogin}


# Authenticate user sign-in into database.
@auth_blueprint.route('/signin', methods=['POST'])
def signin():   
    # Get sign-in information from frontend. 
    req_data = request.get_json()
    email = req_data['email']
    password = req_data['password']

    # Get password for provided email.
    cursor.execute("SELECT pass_hash FROM users WHERE email='%s'" % email)
    stored_Password = cursor.fetchone()

    # Check to see if an account exists with password for that email. 
    if stored_Password is not None:
        stored_Password = stored_Password[0]

        ph = argon2.PasswordHasher()

        try:
            verified = ph.verify(stored_Password, password)
        except argon2.exceptions.VerifyMismatchError:
            verified = False

        # If passwords match.
        if verified:
            # Get associating user id (uid) for that email.
            cursor.execute('SELECT uid FROM users WHERE email = "%s"' % email)
            uid = cursor.fetchone()
            uid = uid[0]

            # Generate authkey.
            authkey = ''.join((random.choice(string.ascii_letters + string.digits) for i in range(16)))

            # Check to see if the uid exists within the auth table or not.
            cursor.execute('SELECT uid FROM auth WHERE uid=%s' % uid)
            fetch = cursor.fetchall()

            # If uid doesn't exist, than insert it with it's corresponding uid. 
            if len(fetch) == 0:
                cursor.execute('INSERT INTO auth (authkey, uid) VALUES ("%s", %s)' % (authkey, uid))

            # UID already exists in auth, so update the authkey with the newly generated authkey.
            else:
                cursor.execute('UPDATE auth SET authkey = "%s" WHERE uid=%s' % (authkey, uid))

            # update last_login property for the user
            cursor.execute('UPDATE users SET last_login = "%s" WHERE uid=%s' % (datetime.now(), uid))

            # Successful login, status will return 'null' indicating so. If status value is other than 'null', it means bad login.
            status = None

        # If passwords don't match.
        else:
            authkey = None
            status = 'Wrong password'

        # Commit changes to the database and bundle .json to be returned back to frontend.
        database.commit()
        output = json.dumps({'authkey': authkey, 'status': status})
        return output
