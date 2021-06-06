from flask import Blueprint, request
import mysql.connector

database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
cursor = database.cursor()

editInfo_blueprint = Blueprint('editInfo_blueprint', __name__)

# Make changes to account information for a given user account.
@editInfo_blueprint.route('/editInfo', methods=['POST'])
def editInfo():
    # Read information to change from frontend.
    # authkey is to determine uid to change info for. (Not changing the authkey).
    req_data = request.get_json()
    authkey = req_data['authkey']
    first_name = req_data['first_name']
    last_name = req_data['last_name']
    email = req_data['email']
    isClient = req_data['client']

    # Get uid for given authkey.
    cursor.execute('SELECT uid FROM auth WHERE authkey="%s"' % authkey)
    uid = cursor.fetchone()
    uid = uid[0]

    # Update account information for that uid within the db.
    query = 'UPDATE users SET email="%s", first_name="%s", last_name="%s", client=%s WHERE uid=%s'
    cursor.execute(query % (email, first_name, last_name, isClient, uid))
    
    # Commit changes to database.
    database.commit()
    
    return {'uid': uid}
