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
                # Read a line, decode from bytes to string, and strip whitespace
                line = ser.readline().decode('utf-8').strip()
                
                # Logic handling: Since your Arduino sends values one by one 
                # followed by commas and strings, we just print them here.
                if line:
                    print(f"Received: {line}")
                    
                    # You can implement threshold logic here
                    # Example: if "TAP" in line: do_something()

            time.sleep(0.05) # Equivalent to delay(50)

    except serial.SerialException as e:
        print(f"Error: {e}")
    except KeyboardInterrupt:
        print("\nStopping script...")
    finally:
        if 'ser' in locals() and ser.is_open:
            ser.close()

if __name__ == "__main__":
    main()