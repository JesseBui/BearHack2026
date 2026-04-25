import serial
import time
import sys

def get_port():
    # Check if the operating system is Windows
    if sys.platform.startswith('win'):
        return 'COM8'
    # Check if it's macOS (darwin)
    if sys.platform.startswith('darwin'):
        return '/dev/cu.usbmodem9C139E9B8D5C2'
    

SERIAL_PORT = get_port()
BAUD_RATE = 9600

def main():
    try:
        # Equivalent to Serial.begin(9600)
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
        time.sleep(2) # Wait for connection to initialize
        
        last_touch = "0" # Python is dynamic, but we'll treat this as a string from Serial

        print("Listening for data...")

        while True:
            if ser.in_waiting > 0:
                # Read the full line ending in \n
                line = ser.readline().decode('utf-8').strip()
                
                if line:
                    # Split the line into a list of strings
                    # e.g., ["450", "120", "0", "1", "NONE"]
                    data = line.split(",")

                    # Ensure we have all 5 pieces of data before printing
                    if len(data) == 5:
                        light = data[0]
                        sound = data[1]
                        btn1  = data[2]
                        btn2  = data[3]
                        touch = data[4]

                        # Clean, labeled output
                        print(f"--- SENSOR DATA ---")
                        print(f"Light Level:  {light}")
                        print(f"Sound Level:  {sound}")
                        print(f"Buttons:      1: {btn1} | 2: {btn2}")
                        print(f"Touch State:  {touch}")
                        print("-" * 20)

            time.sleep(0.01) # Faster polling for better response

    except serial.SerialException as e:
        print(f"Error: {e}")
    except KeyboardInterrupt:
        print("\nStopping script...")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()

if __name__ == "__main__":
    main()