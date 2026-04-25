import serial
import time
import sys

def get_port():
    if sys.platform.startswith('win'):
        return 'COM8'
    if sys.platform.startswith('darwin'):
        return '/dev/cu.usbmodem9C139E9B8D5C2'

SERIAL_PORT = get_port()
BAUD_RATE = 9600

size = [20, 40, 60, 80, 100]
size_index = 0

def start(socketio):
    global size_index
    last_btn1 = 0
    last_btn2 = 0

    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
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

                        #cycle size
                        if int(btn2) == 1 and last_btn2 == 0:
                            size_index = (size_index + 1) % len(size)
                            socketio.emit('size', {'size': size[size_index]})
                            print(f"Size changed to: {size[size_index]}")

                        last_btn2 = int(btn2)

            time.sleep(0.01)

    except serial.SerialException as e:
        print(f"Error: {e}")
    except KeyboardInterrupt:
        print("\nStopping script...")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()