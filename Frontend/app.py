from flask import Flask, render_template
from flask_socketio import SocketIO
import threading

import sys

sys.path.append('../Backend/PythonCode') #path for python mapping
import PythonMap

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    thread = threading.Thread(target=PythonMap.start, args=(socketio,))
    thread.daemon = True
    thread.start()

    socketio.run(app, port=5000, debug=True)