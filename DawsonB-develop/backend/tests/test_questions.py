try:
    import sys
    sys.path.append('../')
    import unittest
    from app import app
    from auth import auth_blueprint
    from deleteAccount import deleteAccount_blueprint
    from setClient import setClient_blueprint
    from setAdmin import setAdmin_blueprint
    from createAdminAccount import createAdminAccount_blueprint
    from getUsers import getUsers_blueprint
    from addQuestion import addQuestion_blueprint
    from disableQuestion import disableQuestion_blueprint
    from enableQuestion import enableQuestion_blueprint
    from removeQuestion import removeQuestion_blueprint
    import json
    import mysql.connector
    import os
    
except Exception as E:
    print("Error Whilst Importing modules!")
    print(E)


# Function used to retrieve QID for question.
def get_QID():
    f = open("text/questionQID.txt", "r")
    qid = f.read()
    f.close()
    return qid

# Function used to retrieve authkey of admin from (.txt) file.
def get_Authkey():
    f = open("text/adminAuth.txt", "r")
    authkey = f.read()
    f.close()
    return authkey


class Client:
    # Constructor class. 
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
        app.register_blueprint(addQuestion_blueprint)
        app.register_blueprint(disableQuestion_blueprint)
        app.register_blueprint(enableQuestion_blueprint)
        app.register_blueprint(removeQuestion_blueprint)
    
    '''-----------------------------------/addQuestion TESTING-----------------------------------'''
    def test_addQuestion(self):
        tester = app.test_client(self)
        with open('addQuestion.json') as json_file:
            data = json.load(json_file)
        params = json.dumps({"authkey": get_Authkey(), "questions": data})
        response = tester.post('/addQuestion', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['qids'], None)
        if (data['qids'] != None):
            # Set uid in (.txt) to be used in other endpoints.
            f = open("text/questionQID.txt", "w")
            f.write(str(data['qids'][0]))
            f.close()

    
    '''-----------------------------------/disableQuestion TESTING-----------------------------------'''
    def test_disableQuestion(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey(), "qid": get_QID()})
        response = tester.post('/disableQuestion', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['status'], 'fail')


    '''-----------------------------------/enableQuestion TESTING-----------------------------------'''
    def test_enableQuestion(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey(), "qid": get_QID()})
        response = tester.post('/enableQuestion', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['status'], 'fail')


    '''-----------------------------------/removeQuestion TESTING-----------------------------------'''
    def test_removeQuestion(self):
        tester = app.test_client(self)
        params = json.dumps({"authkey": get_Authkey(), "qid": get_QID()})
        response = tester.post('/removeQuestion', headers={"Content-Type": "application/json"}, data=params, follow_redirects=True)
        # Test for 200 response.
        self.assertEqual(response.status_code, 200)
        # Test for correct response return type.
        self.assertEqual(response.content_type, 'application/json')
        # Test for correct return value.
        data = json.loads(response.get_data(as_text=True))
        self.assertIsNot(data['status'], 'fail')
        
        
        
if __name__ == '__main__':
    # Configure database/user credentials.
    root = Client('127.0.0.1', '8000', 'finnigan.me', 3306, 'dawsonb', 'dawsonb', 'DawsonB')
    config = config('admin@test.com', 'admin', 'test', 1, 'admin123')
    database = mysql.connector.connect(host='finnigan.me', port=3306, user='dawsonb', password='dawsonb', db='DawsonB')
    cursor = database.cursor()

    # Run unit-test.
    print('QUESTIONS TESTS:')
    unittest.main(exit=False)
    
