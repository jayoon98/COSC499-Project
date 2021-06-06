from flask import Blueprint, request
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

preferences_blueprint = Blueprint('preferences_blueprint', __name__)


# Make changes to preferences/settings for a given user account.
@preferences_blueprint.route('/preferences', methods=['GET', 'POST'])
def preferences():
    req_data = request.get_json()
    authKey = req_data['authkey']
    setting = req_data['setting']
    value = req_data['value']

    # Get uid associating with the authKey.
    cursor.execute('SELECT uid FROM auth WHERE authKey="%s"' % authKey)
    uid = cursor.fetchone()[0]

    # Update the setting with the supplied value.
    if setting == 'notify_time':
        cursor.execute('UPDATE preferences SET notify_time = %s WHERE uid = %s' % (value, uid))
    elif setting == 'circle_colors':
        cursor.execute('UPDATE preferences SET circle_colors = "%s" WHERE uid = %s' % (value, uid))
    elif setting == 'circle_rank':
        cursor.execute('UPDATE preferences SET circle_rank = "%s" WHERE uid = %s' % (value, uid))
    elif setting == 'avatar':
        cursor.execute('UPDATE preferences SET avatar = "%s" WHERE uid = %s' % (value, uid))

    database.commit()
    return {'uid': uid, 'setting': setting, 'value': value}
