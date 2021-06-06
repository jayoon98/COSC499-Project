from flask import Blueprint, request
import argon2
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

changePassword_blueprint = Blueprint('changePassword_blueprint', __name__)

# Make password change for a given authkey (uid).
@changePassword_blueprint.route('/editPassword', methods=['POST'])
def editPassword():
    if request.method == 'POST':
        req_data = request.get_json()
        authkey = req_data['authkey']
        current_pass = req_data['current_pass']
        new_pass = req_data['new_pass']

        # Get uid associating with the authKey.
        cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
        uid = cursor.fetchone()[0]

        # Get current password for user in db.
        cursor.execute('SELECT pass_hash FROM users WHERE uid=%s' % uid)
        db_password = cursor.fetchone()[0]

        # Un-hash db password and compare it against user supplied password.
        hasher = argon2.PasswordHasher()
        try:
            verified = hasher.verify(db_password, current_pass)
        except argon2.exceptions.VerifyMismatchError:
            verified = False

        # If passwords match.
        if verified:
            # Get uid associating with the authKey.
            cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
            uid = cursor.fetchone()[0]

            # Hash the new password.
            ph = argon2.PasswordHasher()
            hashedpassword = ph.hash(new_pass)

            # Do another check to ensure that the new entered password is not same as current db password.
            try:
                same_pass_check = hasher.verify(db_password, new_pass)
            except argon2.exceptions.VerifyMismatchError:
                same_pass_check = False

            # If password is the same, than return status='same pass'
            if same_pass_check:
                status = 'samePass'

            # Else, if all checks pass, than finally update the user's password.
            else:
                # Update password for given user with hashed password.
                cursor.execute('UPDATE users SET pass_hash = "%s" WHERE uid = %s' % (hashedpassword, uid))
                status = 'valid'
                database.commit()
        
        else:
            status = 'invalid'

    return {'status': status}
