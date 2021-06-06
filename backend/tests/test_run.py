import time
from flask import Flask

def run(runfile):
      with open(runfile,"r") as rnf:
        exec(rnf.read())
        
run('test.py')
time.sleep(1)  # Time intervals added to allow resources to flush.
run('test_admin.py')
time.sleep(1)
run('test_questions.py')
time.sleep(1)
run('teardown.py')
time.sleep(1)
