from flask import Blueprint, request
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

adminDeleteUser_blueprint = Blueprint('adminDeleteUser_blueprint', __name__)

# Delete user account from database. 
@adminDeleteUser_blueprint.route('/adminDeleteUser', methods=['POST'])
def adminDeleteUccount():
    req_Data = request.get_json()
    authkey = req_Data['authkey'] # authkey for admin account making the change
    uid = req_Data['uid'] # uid to delete

    # Ensure that authkey belongs to admin account.
    cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
    adminUID = cursor.fetchone()[0]
    cursor.execute('SELECT admin FROM users WHERE uid=%s' % adminUID)
    isAdmin = cursor.fetchone()[0]

    if isAdmin == 1:
        # Delete preferences from preferences table associating with this uid.
        cursor.execute('DELETE FROM preferences WHERE uid = %s' % uid)

        # Remove entry from auth table.
        cursor.execute('DELETE FROM auth WHERE uid = "%s"' % uid)

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
    else:
        return {'status': 'fail'}
    
