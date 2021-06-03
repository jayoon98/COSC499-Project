from flask import Blueprint, request
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

deleteAccount_blueprint = Blueprint('deleteAccount_blueprint', __name__)

# Delete user account from database. 
@deleteAccount_blueprint.route('/deleteAccount', methods=['POST'])
def deleteAccount():
    if request.method == 'POST':
        # Get authkey for key.
        req_data = request.get_json()
        authkey = req_data['authkey']

        # Find uid associating with authKey.
        cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
        uid = cursor.fetchone()[0]

        # Delete preferences from preferences table associating with this uid.
        cursor.execute('DELETE FROM preferences WHERE uid = %s' % uid)

        # Remove entry from auth table.
        cursor.execute('DELETE FROM auth WHERE authkey = "%s"' % authkey)

        # Catch NoneType error incase user tries to delete account without filling any surveys.
        try:
            # Get sid 
            cursor.execute('SELECT sid FROM surveys WHERE uid = %s' % uid)
            sid = cursor.fetchall()
            
            for key in sid:
                # Delete each entry for each sid in answers table. 
                cursor.execute('DELETE FROM answers WHERE sid = %s' % key)
            # Delete each entry for sid in surveys table.be
            cursor.execute('DELETE FROM surveys WHERE uid = %s' % uid)
                
        except TypeError:
            status = 'error'
            pass
        
        # Finally, delete user from users table.
        cursor.execute('DELETE FROM users WHERE uid = %s' % uid)
    
        # Commit changes to database.
        database.commit()
            
        status = 'done'
        return {'status': status, 'authkey': authkey}
        
