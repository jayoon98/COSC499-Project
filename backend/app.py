from flask import Flask

# For debugging/testing purposes only. 
# Terminal commands to clear ports.
# sudo lsof -i -P -n | grep LISTEN
# killall python / kill <pid>.

# Import blueprints for all endpoints.
from auth import auth_blueprint
from createAccount import createAccount_blueprint
from deleteAccount import deleteAccount_blueprint
from preferences import preferences_blueprint
from getQuestions import getQuestions_blueprint
from getAccount import getAccount_blueprint
from editInfo import editInfo_blueprint
from submitAnswers import submitAnswers_blueprint
from updatePrefs import updatePrefs_blueprint
from editPassword import changePassword_blueprint
from getScore import getScore_blueprint
from enableQuestion import enableQuestion_blueprint
from disableQuestion import disableQuestion_blueprint
from removeQuestion import removeQuestion_blueprint
from getUsers import getUsers_blueprint
from setAdmin import setAdmin_blueprint
from addQuestion import addQuestion_blueprint
from editQuestion import editQuestion_blueprint
from adminDeleteUser import adminDeleteUser_blueprint
from setClient import setClient_blueprint
from createAdminAccount import createAdminAccount_blueprint

# Create Python Flask Object.
app = Flask(__name__)
app.secret_key = 'DawsonB'

# For testing purposes.
@app.route('/')
def index():
    return 'VHC Backend'

if __name__ == '__main__':
    # Register blueprints. (External .py scripts)
    app.register_blueprint(auth_blueprint)
    app.register_blueprint(createAccount_blueprint)
    app.register_blueprint(deleteAccount_blueprint)
    app.register_blueprint(preferences_blueprint)
    app.register_blueprint(getQuestions_blueprint)
    app.register_blueprint(getAccount_blueprint)
    app.register_blueprint(editInfo_blueprint)
    app.register_blueprint(submitAnswers_blueprint)
    app.register_blueprint(updatePrefs_blueprint)
    app.register_blueprint(changePassword_blueprint)
    app.register_blueprint(getScore_blueprint)
    app.register_blueprint(enableQuestion_blueprint)
    app.register_blueprint(disableQuestion_blueprint)
    app.register_blueprint(removeQuestion_blueprint)
    app.register_blueprint(getUsers_blueprint)
    app.register_blueprint(setAdmin_blueprint)
    app.register_blueprint(addQuestion_blueprint)
    app.register_blueprint(editQuestion_blueprint)
    app.register_blueprint(adminDeleteUser_blueprint)
    app.register_blueprint(setClient_blueprint)
    app.register_blueprint(createAdminAccount_blueprint)
    #app.config['DEBUG'] = True
    #app.config['TESTING'] = True
    app.run('localhost', '8000', debug=True)
