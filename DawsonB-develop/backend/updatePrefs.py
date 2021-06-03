from flask import Blueprint, request
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

updatePrefs_blueprint = Blueprint('updatePrefs_blueprint', __name__)


# Make changes to preferences/settings for a given user account.
@updatePrefs_blueprint.route('/updatePrefs', methods=['GET', 'POST'])
def preferences():
    req_data = request.get_json()
    authKey = req_data['authkey']
    value1 = req_data['pass1']
    value2 = req_data['pass2']
    value3 = req_data['pass3']

    # Get uid associating with the authKey.
    cursor.execute('SELECT uid FROM auth WHERE authKey="%s"' % authKey)
    uid = cursor.fetchone()[0]

    # Update notify_time in database.
    cursor.execute('UPDATE preferences SET notify_time = %s WHERE uid = %s' % (value1, uid))

    # Update circle_colors in database.
    cursor.execute('UPDATE preferences SET circle_colors = "%s" WHERE uid = %s' % (value2, uid))

    # Update circle_rank in database.
    cursor.execute('UPDATE preferences SET circle_rank = "%s" WHERE uid = %s' % (value3, uid))

    database.commit()

    # Return user id back for account that was updated.
    return {'uid': uid}
