try:
    import sys
    # For importing scripts outside of this folder. 
    sys.path.append('../')
    import unittest
    import mysql.connector
    import json
    from flask import Flask
    from app import app
    from auth import auth_blueprint
    from createAccount import createAccount_blueprint
    from getQuestions import getQuestions_blueprint
    from getAccount import getAccount_blueprint
    from preferences import preferences_blueprint
    from editPassword import changePassword_blueprint
    from updatePrefs import updatePrefs_blueprint
    from editInfo import editInfo_blueprint
    from getScore import getScore_blueprint
    
except Exception as E:
    print("Error Whilst Importing modules!")
    print(E)
    

# Function used to retrieve authkey of user from (.txt) file.
def get_Authkey():
    f = open("text/userAuth.txt", "r")
    authkey = f.read()
    f.close()
    return authkey

# Config class used to hold credentials for database/cursor unit-testing.
class Client:
    def __init__(self, host, port, dbHost, dbPort, dbUser, dbPassword, db):
        self.host = host
        self.port = port
        self.dbHost = dbHost
        self.dbPort = dbPort
        self.dbUser = dbUser
        self.dbPassword = dbPassword
        self.db = db
        

# Config class used to hold credentials for client/user unit-testing.
class config:
    def __init__(self, email, firstname, lastname, isClient, password):
        self.email = email
        self.firstname = firstname
        self.lastname = lastname
        self.isClient = isClient
        self.password = password
        
        
class FLaskTest(unittest.TestCase):
    app = Flask(__name__)
    @classmethod
    def setUp(self):
        self.app = app
        self.app.testing = True
        self.app.debug = False
        self.app.register_blueprint(getQuestions_blueprint)
        self.app.register_blueprint(createAccount_blueprint)
        self.app.register_blueprint(getAccount_blueprint)
        self.app.register_blueprint(preferences_blueprint)
        self.app.register_blueprint(changePassword_blueprint)
        self.app.register_blueprint(updatePrefs_blueprint)
        self.app.register_blueprint(editInfo_blueprint)
        self.app.register_blueprint(getScore_blueprint)

    def tearDown(self):
        pass
    
    '''-----------------------------------CLIENT TESTING-----------------------------------'''
    def test_client(self):
        self.assertEqual(root.host, '127.0.0.1')        # host.
        self.assertEqual(root.port, '8000')             # port
        self.assertEqual(root.dbHost, 'finnigan.me')    # dbHost.
        self.assertEqual(root.dbPort, 3306)             # dBPort
        self.assertEqual(root.dbUser, 'dawsonb')        # dbUser
        self.assertEqual(root.dbPassword, 'dawsonb')    # dbPassword
        self.assertEqual(root.db, 'DawsonB')            # db.
        self.assertIsNot(database, None)                # database.
        self.assertIsNot(cursor, None)                  # cursor.

    '''-----------------------------------INDEX TESTING-----------------------------------'''
    def test_index(self):
        tester = app.test_client(self)
        response = tester.get('/', follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'text/html; charset=utf-8')
        # Test for correct return value.
        self.assertTrue(b'VHC Backend' in response.data)
        # Test for valid security key.
        self.assertEqual(app.secret_key, 'DawsonB')
        

    '''-----------------------------------/createAccount TESTING-----------------------------------'''
    def test_createAccount(self):
        tester = app.test_client(self)
        params = json.dumps({"email": config.email, "password": config.password, "first_name": config.firstname, "last_name": config.lastname, "isClient":config.isClient})
        response = tester.post('/createAccount', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Ensure authkey isn't null.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['authkey'], None)
        if (data['authkey'] != None):
            f = open("text/userAuth.txt", "w")
            f.write(data['authkey'])
            f.close()
        # Test for correct return type.
        self.assertEqual(response.content_type, 'application/json')


    '''-----------------------------------/getAccount TESTING-----------------------------------'''
    def test_getAccount(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey()})
        response = tester.post('/getAccount', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')


    '''-----------------------------------/getQuestions TESTING-----------------------------------'''
    def test_getQuestions(self):
        tester = app.test_client(self)
        params = json.dumps({"getDisabled": 0})
        response = tester.post('/getQuestions', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'text/html; charset=utf-8')


    '''-----------------------------------/preferences TESTING-----------------------------------'''
    def test_preferences(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey(), "setting": 'notify_time', "value": 3})
        response = tester.post('/preferences', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')


    '''-----------------------------------/editPassword TESTING-----------------------------------'''
    def test_editPassword(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey(), "current_pass": config.password, "new_pass": 'client12345'})
        response = tester.post('/editPassword', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data['status'], 'valid')


    '''-----------------------------------/updatePrefs TESTING-----------------------------------'''
    def test_updatePrefs(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey(), "pass1": 7, "pass2": '419C59,F5160A,0C6DCF,5B64C2,F0A93E', "pass3": '12345'})
        response = tester.post('/updatePrefs', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['uid'], None)
        if (data['uid'] != None):
            f = open("text/userUID.txt", "w")
            f.write(str(data['uid']))
            f.close()

    
    '''-----------------------------------/editInfo TESTING-----------------------------------'''
    def test_editInfo(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey(), "first_name": 'client', "last_name": 'test', "email": 'client@test.com', "client": 1})
        response = tester.post('/editInfo', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['uid'], None)
        if (data['uid'] != None):
            f = open("text/userUID.txt", "w")
            f.write(str(data['uid']))
            f.close()


    '''-----------------------------------/getScores TESTING-----------------------------------'''
    def test_getScores(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey()})
        response = tester.post('/getScore', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data, None)


if __name__ == '__main__':
    # Configure database/user credentials.
    root = Client('127.0.0.1', '8000', 'finnigan.me', 3306, 'dawsonb', 'dawsonb', 'DawsonB')
    config = config('client@test.com', 'test', 'client', 1, 'client123')
    database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
    cursor = database.cursor()

    # Run unit-test.
    print('CLIENT/USER TESTS:')
    unittest.main(exit=False)
