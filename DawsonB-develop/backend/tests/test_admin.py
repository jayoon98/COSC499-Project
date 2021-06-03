try:
    import sys
    sys.path.append('../')
    import unittest
    import mysql.connector
    import json
    from app import app
    from auth import auth_blueprint
    from deleteAccount import deleteAccount_blueprint
    from setClient import setClient_blueprint
    from setAdmin import setAdmin_blueprint
    from createAdminAccount import createAdminAccount_blueprint
    from getUsers import getUsers_blueprint
    
except Exception as E:
    print("Error Whilst Importing modules!")
    print(E)


# Function used to retrieve uid of user from (.txt) file.
def get_UID():
    f = open("text/userUID.txt", "r")
    uid = f.read()
    f.close()
    return uid


# Function used to retrieve authkey of admin from (.txt) file.
def get_Authkey():
    f = open("text/adminAuth.txt", "r")
    authkey = f.read()
    f.close()
    return authkey


class Client:
    def __init__(self, host, port, dbHost, dbPort, dbUser, dbPassword, db):
        self.host = host
        self.port = port
        self.dbHost = dbHost
        self.dbPort = dbPort
        self.dbUser = dbUser
        self.dbPassword = dbPassword
        self.db = db


class config:
    def __init__(self, email, firstname, lastname, isClient, password):
        self.email = email
        self.firstname = firstname
        self.lastname = lastname
        self.isClient = isClient
        self.password = password
        

class FLaskTest(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG'] = False
        app.register_blueprint(setClient_blueprint)
        app.register_blueprint(setAdmin_blueprint)
        app.register_blueprint(deleteAccount_blueprint)
        app.register_blueprint(createAdminAccount_blueprint)
        app.register_blueprint(getUsers_blueprint)
        app.register_blueprint(auth_blueprint)

    def tearDown(self):
        pass
    
    
    '''-----------------------------------/createAccount TESTING-----------------------------------'''
    def test_createAccount(self):
        tester = app.test_client(self)
        params = json.dumps({"email": config.email, "password": config.password, "first_name": config.firstname, "last_name": config.lastname, "isAdmin":config.isClient})
        response = tester.post('/createAdminAccount', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        #Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Ensure authkey isn't null.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['authkey'], None)
        if (data['authkey'] != None):
            # Set authkey in (.txt) to be used in other endpoints.
            f = open("text/adminAuth.txt", "w")
            f.write(data['authkey'])
            f.close()
        # Test for correct return type.
        self.assertEqual(response.content_type, 'application/json')
        

    '''-----------------------------------/setClient TESTING-----------------------------------'''
    def test_setClient(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey(), "uid": get_UID(), 'makeClient': 1})
        response = tester.post('/setClient', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['status'], 'success')
        

    '''-----------------------------------/setClient TESTING-----------------------------------'''
    def test_setAdmin(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey(), "uid": get_UID(), 'makeAdmin': 1})
        response = tester.post('/setAdmin', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['status'], 'success')


    '''-----------------------------------/getUsers TESTING-----------------------------------'''
    def test_getUsers(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey()})
        response = tester.post('/getUsers', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['users'], None)
        
        
if __name__ == '__main__':
    # Configure database/user credentials.
    root = Client('127.0.0.1', '8000', 'finnigan.me', 3306, 'dawsonb', 'dawsonb', 'DawsonB')
    config = config('admin@test.com', 'admin', 'test', 1, 'admin123')
    database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
    cursor = database.cursor()

    # Run unit-test.
    print('ADMIN TESTS:')
    unittest.main(exit=False)
