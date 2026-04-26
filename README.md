# 🎨 Picasso Canvas

> A revolutionary drawing program built at BearHack 2026.

Picasso Canvas is an interactive drawing application that bridges the gap between physical hardware and digital art. Draw, create, and express yourself through an intuitive web-based canvas powered by a Python backend and real-time serial device communication.

---

## ✨ Features

- **Interactive Drawing Canvas** — Smooth, responsive drawing experience in the browser
- **Hardware Integration** — Communicates with an Arduino Uno R4 via serial (USB/COM) port
- **Real-Time Updates** — Live input processing between the hardware controller and the web frontend
- **Clean UI** — Minimalist interface built with vanilla HTML, CSS, and JavaScript

---

## 🗂️ Project Structure

```
BearHack2026/
├── Backend/          # Flask server & serial communication logic
├── Frontend/         # HTML, CSS, and JavaScript canvas UI
├── requirements.txt  # Python dependencies
└── README.md
```

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | HTML, CSS, JavaScript             |
| Backend   | Python, Flask                     |
| Hardware  | C++, PySerial (serial/USB bridge) |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- pip
- A compatible serial input device (optional for hardware features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JesseBui/BearHack2026.git
   cd BearHack2026
   ```

2. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask backend**
   ```bash
   cd Backend/PythonFlask
   python app.py
   ```

4. **Open the frontend**

   Open `Frontend/templates/index.html` in your browser, or navigate to `http://localhost:5000` if the backend serves the frontend directly.

---

## 🔌 Hardware Setup

Picasso Canvas uses an **Arduino Uno R4** as its hardware input controller, connected via USB serial:

1. Flash the firmware from the `Backend/` directory to your device
2. Connect the device via USB
3. Update the serial port configuration in the backend to match your system (e.g., `COM3` on Windows, `/dev/ttyUSB0` on Linux/macOS)
4. Launch the Flask server — it will automatically listen for serial input

---

## 📦 Dependencies

```
Flask==3.1.3
pyserial==3.5
Werkzeug==3.1.8
Jinja2==3.1.6
click==8.3.3
itsdangerous==2.2.0
MarkupSafe==3.0.3
blinker==1.9.0
```

---

## 🏆 Built At

**BearHack 2026** 

---

## 👤 Author

**Jesse Bui** — [@JesseBui](https://github.com/JesseBui)
**Amara Hussain** - [@husamara](https://github.com/husamara)
**Puneet Shetty** [@shettypu](https://github.com/shettypu)
**Nicholas Dos Santos** - [@dossanic](https://github.com/dossanic)

---

## 📄 License

This project is open source. Feel free to fork, build on it, and make something awesome.
