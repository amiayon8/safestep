# 🦶 SafeStep – Smart Assistance & Tracking for the Visually Impaired

> “Because every step should be a safe step.”

SafeStep is an **IoT-powered smart assistance and tracking system** designed to help locate visually impaired individuals in real-time.  
It combines **ESP32**, **ultrasonic sensors**, **GPS**, **Supabase**, and a **web dashboard** to enable **live location tracking, obstacle alerts, and emergency monitoring**.

🌐 **Live Dashboard:** [https://safestep.thenicedev.xyz](https://safestep.thenicedev.xyz)  
📘 **Detailed Documentation:** [SafeStep on Notion](https://www.notion.so/SafeStep-284984bc3ea780fdb5d6f63c1197ec27?source=copy_link)

---

## 🚀 Overview

SafeStep is a smart wearable device for **blind or visually impaired users** that:
- Detects nearby **obstacles** using an **ultrasonic sensor** and **buzzer alerts**.
- Tracks **real-time GPS coordinates** using **TinyGPS++**.
- Sends live data securely to **Supabase** via **HTTPS**.
- Broadcasts updates to the **web dashboard** using **WebSockets**.
- Allows caregivers or family members to **locate the user instantly** via the dashboard.

---

## 🧠 System Architecture

```text
┌────────────────────┐
│   SafeStep Device  │
│  (ESP32 + Sensors) │
└────────────────────┘
         │  
         │  HTTPS (JSON)
         │  
         ▼
┌─────────────────────┐
│     Supabase DB     │
│  (Data + Auth + API)│
└─────────────────────┘
         │  
         │  WebSocket
         │  
         ▼
┌────────────────────────────────┐
│   Web Dashboard                │
│ https://safestep.thenicedev.xyz│
└────────────────────────────────┘
````

---

## ⚙️ Hardware Components

| Component                           | Description                               |
| ----------------------------------- | ----------------------------------------- |
| **ESP32 NodeMCU (DevKit Wroom-32)** | Core microcontroller with Wi-Fi           |
| **RC522 RFID (optional)**           | For authentication or attendance tracking |
| **HC-SR04 Ultrasonic Sensor**       | Detects obstacles and distance            |
| **Buzzer**                          | Provides proximity audio feedback         |
| **I2C LCD Display**                 | Displays system status                    |
| **GPS Module (NEO-6M or similar)**  | Provides live location data               |
| **TP4056 Module**                   | Battery charging and protection           |
| **18650 Li-ion Battery (x1–3)**     | Portable power source                     |

---

## 💻 Software Stack

| Layer                | Technology                                                           |
| -------------------- | -------------------------------------------------------------------- |
| **Firmware**         | Arduino C++ on ESP32                                                 |
| **Backend**          | [Supabase](https://supabase.com/) (PostgreSQL + REST API + Realtime) |
| **Frontend**         | [Next.js](https://nextjs.org/) dashboard                             |
| **Realtime Updates** | Supabase Realtime via WebSockets                                     |
| **Hosting**          | Vercel (Frontend), Supabase Cloud (Backend)                          |

---

## 🔩 Device Features

* ✅ **Ultrasonic Distance Detection**
  Buzzer beeps at different rates depending on how close obstacles are.

* 📡 **GPS Tracking**
  Sends latitude, longitude, speed, and timestamp to Supabase.

* 🔒 **Secure HTTPS Uploads**
  Uses `WiFiClientSecure` and Supabase REST API for encrypted data transmission.

* 🌍 **Realtime Web Dashboard**
  Displays user’s last known location and status via WebSockets.

* 🔋 **Battery Powered**
  Supports single or multiple 18650 cells with TP4056 charging.

---

## 🧰 Code Highlights

* Distance measured via `HC-SR04`
* Buzzer feedback based on proximity
* GPS handled using `TinyGPS++`
* Secure POST to Supabase using `HTTPClient`
* Data serialized with `ArduinoJson`

---

## 🔧 Setup Guide

### 1. Flash the Firmware

1. Open the `/firmware/SafeStep.ino` file in **Arduino IDE** or **PlatformIO**.
2. Select **ESP32 Dev Module**.
3. Install dependencies:

   * `TinyGPSPlus`
   * `ArduinoJson`
   * `WiFi`
   * `HTTPClient`
4. Update your WiFi credentials and Supabase key in the code.
5. Upload the sketch.

### 2. Power the Device

* Power via USB or 18650 battery through TP4056.
* On boot, it connects automatically to Wi-Fi and starts sending data.

### 3. View Data

* Visit [SafeStep Dashboard](https://safestep.thenicedev.xyz) to view live tracking and status.
* The data updates in **real-time** via **Supabase Realtime API**.

---

## 🛰️ Example Data Sent to Supabase

```json
{
  "latitude": 23.7808875,
  "longitude": 90.2792371,
  "altitude": 7.8,
  "speed": 2.3,
  "course": 175.6,
  "satellites": 9,
  "hdop": 0.9,
  "gps_date": "2025-10-07",
  "gps_time": "18:24:52"
}
```

---

## 🌈 Vision

> SafeStep aims to provide a **low-cost, scalable** solution to assist visually impaired individuals by enhancing **mobility safety** and **location awareness**.

This project combines **IoT innovation** and **real-time cloud integration** to make life easier and safer — one step at a time.

---

## 🧑‍💻 Author

**👨‍💻 Sarker Ayon**
*Student at Rajuk Uttara Model College*
🌐 [thenicedev.xyz](https://www.thenicedev.xyz)

---

## 📜 License

This project is licensed under the **MIT License** — feel free to fork, contribute, and innovate.

---

**SafeStep – A Smarter Path for the Visually Impaired.**
