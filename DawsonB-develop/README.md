# Virtual Health Circles
COSC 499 group project by group Dawson Psychological Services B

## ![#1589F0](https://via.placeholder.com/15/1589F0/000000?text=+) `To run:`

### Frontend:
1. Install node.js (LTS): https://nodejs.org/en/

2. Using the command line, run **_npm install_**

3. Using the command line, while inside the /frontend directory, you can run several commands:
  - **_npm run dev_**: Starts the development server. **You probably want this.**
  - **_npm run build_**: Builds the app for production.
  - **_npm start_**: Runs the built app in production mode.
  
### Backend:
1. Ensure that Python is installed on your computer. Check python installation by running: 'python --version' in terminal/cmd. 

   Link to python installation (reccommended Python 3.8): https://www.python.org/downloads/

2. For the backend development, the reccommended compilers are Pycharm Community Edition & The Python IDLE. 

   Please ensure you have one of these installed. 

3. In terminal/cmd, cd into the backend folder. Setup the virtual environment (venv): **_python -m venv myproject_**

   * myproject can be any folder name you choose, for simplicity name it 'VHC'. 

4. Next, activate the virtualenv. 

   For (OS X & Linux): **_source myproject/bin/activate_**

   For (Windows): **_myproject\Scripts\activate_**
   
5. Finally, install the Flask library into this virtualenv. To do so run the following command:

   **_pip install Flask_**; Use **_pip3 install Flask_** if any errors arise. 
   
6. To run the backend server, just run **_app.py_** using any IDLE of your choice.
    
## ![#c5f015](https://via.placeholder.com/15/c5f015/000000?text=+) `To develop:`

### Frontend:
VS Code/VSCodium is recommended, along with the GitLens extension for in-editor Git capabilites, and ESLint to automatically enforce linting (code styling) - AirBnB style is used.

Next, go to File > Preferences > Settings, then 'Search settings' for 'Eol'. Change it from 'auto' to '\n'. Also search for 'Tab Size', and change the number to 2.

In the command line, run the following command to ensure Git also doesn't enforce using the wrong line endings: **_git config --global core.autocrlf input_**

After opening the editor, go to File > Open Workspace... > choose the '/frontend' folder. Every time you open the editor, you will now be in the proper workspace.

### Backend:
All backend development is done within Pycharm Community Edition (https://www.jetbrains.com/pycharm/download/) or the Python IDLE. 

**_APP.PY_**: Is the index file that is called when the backend server is up and running. (This is the file you should run for the backend.)
All the endpoints and blueprints are included within this script.

## ![#f03c15](https://via.placeholder.com/15/f03c15/000000?text=+) `To test:`

### Frontend
You must install Cypress for testing. In the command line, while in the /frontend directory, run **_npm install cypress_**. After it completes, run **_npm run cypress:open_**, and ensure it opens properly. Any time you wish to run Cypress tests (user perspective, end-to-end tests), you may open this Cypress interface with that command. At the top-right of the window, if 'Firefox' is selected, click it and change it to 'Electron'.

### Backend
The backend was tested using Python's unittest library. There are multiple ways to execute these files, however we suggest the following: 

Either using the command line or a idle, direct yourself to the [tests] folder provided in the backend:

1. **_Run test.py_**: This tests user/client features (non-admin features) alternatively run using cmd: **_Python test.py_**
2. **_Run test_admin.py_** This tests features special to the admin. 
3. **_Run test_questions.py_** This tests features relating to the addition/deletion/altering of questions in the database.
4. **_Run teardown.py_** This tests the closing down features of the application (deleting account, deleting admin account, etc).

It is critical that you run these files in the order they are listed. 
Also due to a 'NoneType' bug, we aren't able to run all unittest at once using the: **_python -m unittest_** command. 
So it is reccommended that you run each script individually to prevent errors.

