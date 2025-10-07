#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>
#include <ArduinoJson.h>

// ================== WiFi Config ==================
const char* ssid = "Ayon";
const char* password = "Ayon.2008";

// ================== Supabase Config ==================
const char* supabase_url = "https://tjqnvnbusuiizxjebayp.supabase.co/rest/v1/gps_data";
const char* supabase_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqcW52bmJ1c3VpaXp4amViYXlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDkxMzYsImV4cCI6MjA2Mjg4NTEzNn0.E0KSKTTjd4hTe0gN4ARazt-eJpZRWwFqqzUSVsHhfcM";

// ================== GPS Setup ==================
TinyGPSPlus gps;
HardwareSerial SerialGPS(2);  // RX2 = GPIO16, TX2 = GPIO17

// ================== Ultrasonic Sensor Pins ==================
const int trigPin = 4;
const int echoPin = 18;
const int buzzerPin = 26;

// Distance thresholds (cm)
const int dangerDist = 15;
const int closeDist = 30;
const int mediumDist = 70;
const int farDist = 100;

WiFiClientSecure client;

// ================== Setup ==================
void setup() {
  // Serial.begin(115200);
  SerialGPS.begin(9600, SERIAL_8N1, 16, 17);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);

  // Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    // Serial.print(".");
  }
  // Serial.println("\n✅ Connected to WiFi");
  client.setInsecure();  // Disable SSL verification (for simplicity)
}

// ================== Measure Distance ==================
long measureDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH);
  long distance = duration * 0.034 / 2;
  return distance;
}

// ================== Send GPS Data to Supabase ==================
void sendToSupabase() {
  StaticJsonDocument<256> doc;
  doc["latitude"] = gps.location.lat();
  doc["longitude"] = gps.location.lng();
  doc["altitude"] = gps.altitude.meters();
  doc["speed"] = gps.speed.kmph();
  doc["course"] = gps.course.deg();
  doc["satellites"] = gps.satellites.value();
  doc["hdop"] = gps.hdop.value() / 100.0;

  if (gps.date.isValid()) {
    char dateStr[11];
    sprintf(dateStr, "%04d-%02d-%02d", gps.date.year(), gps.date.month(), gps.date.day());
    doc["gps_date"] = dateStr;
  }

  if (gps.time.isValid()) {
    char timeStr[9];
    sprintf(timeStr, "%02d:%02d:%02d", gps.time.hour(), gps.time.minute(), gps.time.second());
    doc["gps_time"] = timeStr;
  }

  String json;
  serializeJson(doc, json);

  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, supabase_url);
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", supabase_key);
    http.addHeader("Authorization", String("Bearer ") + supabase_key);

    int httpResponseCode = http.POST(json);

    if (httpResponseCode > 0) {
      // Serial.print("✅ POST Response: ");
      // Serial.println(httpResponseCode);
      // Serial.println(http.getString());
    } else {
      // Serial.print("❌ Error sending POST: ");
      // Serial.println(http.errorToString(httpResponseCode));
    }

    http.end();
  } else {
    // Serial.println("⚠️ WiFi not connected!");
  }
}

// ================== Loop ==================
void loop() {
  // --------- Distance Measurement ---------
  long distance = measureDistance();
  // Serial.print("Distance: ");
  // Serial.print(distance);
  // Serial.println(" cm");

  if (distance <= dangerDist) {
    tone(buzzerPin, 3500);
  } else if (distance <= closeDist) {
    tone(buzzerPin, 3000);
    delay(100);
    noTone(buzzerPin);
    delay(100);
  } else if (distance > closeDist && distance <= mediumDist) {
    tone(buzzerPin, 2000);
    delay(250);
    noTone(buzzerPin);
    delay(1000);
  } else if (distance > mediumDist && distance <= farDist) {
    tone(buzzerPin, 1000);
    delay(500);
    noTone(buzzerPin);
    delay(1500);
  } else {
    noTone(buzzerPin);
    delay(500);
  }

  // --------- GPS Reading ---------
  while (SerialGPS.available() > 0) {
    gps.encode(SerialGPS.read());
  }

  // --------- Send to Supabase if new data ---------
  if (gps.location.isUpdated()) {
    sendToSupabase();
  }
}
