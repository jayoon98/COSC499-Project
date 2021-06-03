try:
    import sys
    sys.path.append('../')
    import unittest
    from app import app
    from auth import auth_blueprint
    from deleteAccount import deleteAccount_blueprint
    from adminDeleteUser import adminDeleteUser_blueprint
    import json
    import mysql.connector
    import os
    from test import Client, config
    
except Exception as E:
    print("Error Whilst Importing modules!")
    print(E)

def get_UID():
    f = open("text/userUID.txt", "r")
    uid = f.read()
    f.close()
    return uid

def get_admin_Authkey():
    f = open("text/adminAuth.txt", "r")
    authkey = f.read()
    f.close()
    return authkey

def get_client_Authkey():
    f = open("text/userAuth.txt", "r")
    authkey = f.read()
    f.close()
    return authkey

class FLaskTest(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG'] = False
        app.register_blueprint(deleteAccount_blueprint)
        app.register_blueprint(auth_blueprint)
        app.register_blueprint(adminDeleteUser_blueprint)

    def tearDown(self):
        pass
    
    '''-----------------------------------/deleteAccount TESTING-----------------------------------'''
    def test_deleteAccount_Admin(self):
        tester = app.test_client(self)
        authkey = get_admin_Authkey()
        uid = get_UID()
        params = json.dumps({"authkey": authkey, "uid": uid})
        response = tester.post('/adminDeleteUser', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['status'], 'done')
    
    '''-----------------------------------/deleteAccount TESTING-----------------------------------'''
    # Testing deletion of user account. Couldn't test in test.py because there was an issue with testing signin and delete in same unnittest. (Not an issue with app).
    def test_deleteAdminAccount(self):
        tester = app.test_client(self)
        authkey = get_admin_Authkey()
        params = json.dumps({"authkey": authkey})
        response = tester.post('/deleteAccount', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['status'], 'done')

    

if __name__ == '__main__':
    root = Client('127.0.0.1', '8000', 'finnigan.me', 3306, 'dawsonb', 'dawsonb', 'DawsonB')
    config = config('admin@test.com', 'test', 'admin', 1, 'admin123')
    database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
    cursor = database.cursor()
    
    # Run unit-test.
    print('TEARDOWN TESTS:')
    unittest.main(exit=False)
