from flask import Flask, render_template, jsonify
import serial, threading, time, sys

def get_port():
    if sys.platform.startswith('win'):
        return 'COM8'
    if sys.platform.startswith('darwin'):
        return '/dev/cu.usbmodem9C139E9B8D5C2'

BAUD_RATE = 9600
latest = {}

def read_serial():
    ser = serial.Serial(get_port(), BAUD_RATE, timeout=1)
    time.sleep(2)
    print("Listening for data...")

    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').strip()
            if line:
                data = line.split(",")
                if len(data) == 5:
                    light = data[0]
                    sound = data[1]
                    btn1  = data[2]
                    btn2  = data[3]
                    touch = data[4]

                    print(f"--- SENSOR DATA ---")
                    print(f"Light Level:  {light}")
                    if int(sound) >= 200:
                        print(f"Sound Level:  {sound}")
                    print(f"Buttons:      1: {btn1} | 2: {btn2}")
                    print(f"Touch State:  {touch}")
                    print("-" * 20)

                    latest['light'] = light
                    latest['sound'] = sound
                    latest['btn1']  = btn1
                    latest['btn2']  = btn2
                    latest['touch'] = touch

        time.sleep(0.01)

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def data():
    return jsonify(latest)

if __name__ == '__main__':
    t = threading.Thread(target=read_serial, daemon=True)
    t.start()
    app.run(debug=True, use_reloader=False, port = 5001)