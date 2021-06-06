from flask import Blueprint, request
import string
import random
from argon2 import PasswordHasher
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

createAccount_blueprint = Blueprint('createAccount_blueprint', __name__)

@createAccount_blueprint.route('/createAccount', methods=['POST'])
def createAccount():
    req_data = request.get_json()
    email = req_data['email']
    first_name = req_data['first_name']
    last_name = req_data['last_name']
    password = req_data['password']
    isClient = req_data['isClient']

    ph = PasswordHasher();
    hashedPassword = ph.hash(password);

    # Conduct query to determine whether user has an account in database/ or not.
    cursor.execute('SELECT email FROM users WHERE email = "%s"' % email)
    fetchedEmails = cursor.fetchone()

    # Email doesn't exist in database, so proceed with creating the account.
    if fetchedEmails is None:
        # Insert user into database as a new user.
        query = "INSERT INTO users (email, pass_hash, first_name, last_name, client) VALUES ('%s', '%s','%s', '%s', %s)"
        cursor.execute(query % (email, hashedPassword, first_name, last_name, isClient))

        # Generate an authkey for the user and log them into the database by inserting authkey into auth table for the corresponding user id.
        authkey = ''.join((random.choice(string.ascii_letters + string.digits) for i in range(16)))

        # Get the user id for the current user.
        cursor.execute('SELECT uid FROM users WHERE email = "%s"' % email)
        uid = cursor.fetchone()[0]

        # Insert the default preferences for a new account into the preferences table.
        c_c = "419C59,F5160A,0C6DCF,5B64C2,F0A93E"
        c_r = "12345"
        n_t = 7
        avatar = "2,0,0,2,2" # avatar customization string (bg, torso, skin, mood, hair)
        cursor.execute('INSERT INTO preferences (uid, circle_colors, circle_rank, notify_time, avatar) VALUES (%s, "%s", "%s", %s, "%s")' % (uid, c_c, c_r, n_t, avatar))

        # Check to see if the uid exists within the auth table or not.
        cursor.execute('SELECT uid FROM auth WHERE uid=%s' % uid)
        fetch = cursor.fetchall()

        # UID not found in auth, so create new entry.
        if len(fetch) == 0:
            cursor.execute('INSERT INTO auth (authkey, uid) VALUES ("%s", %s)' % (authkey, uid))

        # UID already exists in auth, so update the authkey with the newly generated authkey.
        else:
            cursor.execute('UPDATE auth SET authkey = "%s" WHERE uid=%s' % (authkey, uid))

    # Account already exist with this email address.
    else:
        authkey = None # null authkey.

    # Commit changes to database.
    database.commit()

    # Return authkey to the frontend.
    return {'authkey': authkey}
