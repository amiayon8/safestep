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
const int dangerDist = 25;
const int closeDist = 50;
const int mediumDist = 80;
const int farDist = 100;

// ================== Timing Intervals ==================
const unsigned long distanceInterval = 200;   // every 200ms
const unsigned long gpsInterval = 50;         // process GPS serial often
const unsigned long sendInterval = 5000;      // every 5 seconds

// ================== State Variables ==================
unsigned long lastDistanceMillis = 0;
unsigned long lastGpsMillis = 0;
unsigned long lastSendMillis = 0;

long lastDistance = 0;
unsigned long buzzerTimer = 0;
bool buzzerOn = false;
int buzzerPattern = 0;

WiFiClientSecure client;

// ================== Setup ==================
void setup() {
  Serial.begin(115200);
  SerialGPS.begin(9600, SERIAL_8N1, 16, 17);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);
  noTone(buzzerPin);

  WiFi.begin(ssid, password);
  client.setInsecure();
}

// ================== Non-blocking Distance Measurement ==================
long measureDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 25000);  // 25ms timeout
  if (duration == 0) return 999;  // out of range
  return duration * 0.034 / 2;
}

// ================== Buzzer Pattern Controller ==================
void updateBuzzer() {
  unsigned long now = millis();

  switch (buzzerPattern) {
    case 0:  // dangerDist (continuous tone)
      tone(buzzerPin, 1000);
      break;

    case 1:  // closeDist (beep 100ms on/off)
      if (now - buzzerTimer >= 100) {
        buzzerTimer = now;
        if (buzzerOn) noTone(buzzerPin);
        else tone(buzzerPin, 1500);
        buzzerOn = !buzzerOn;
      }
      break;

    case 2:  // mediumDist (250ms on, 1s off)
      if (now - buzzerTimer >= (buzzerOn ? 250 : 1000)) {
        buzzerTimer = now;
        if (buzzerOn) noTone(buzzerPin);
        else tone(buzzerPin, 2000);
        buzzerOn = !buzzerOn;
      }
      break;

    case 3:  // farDist (500ms on, 1.5s off)
      if (now - buzzerTimer >= (buzzerOn ? 500 : 1500)) {
        buzzerTimer = now;
        if (buzzerOn) noTone(buzzerPin);
        else tone(buzzerPin, 3000);
        buzzerOn = !buzzerOn;
      }
      break;

    case 4:  // idle (off)
      noTone(buzzerPin);
      buzzerOn = false;
      break;
  }
}

// ================== Distance Logic ==================
void handleDistance() {
  long distance = measureDistance();
  if (distance != lastDistance) {
    Serial.print("Distance: ");
    Serial.print(distance);
    Serial.println(" cm");
    lastDistance = distance;
  }

  if (distance <= dangerDist) buzzerPattern = 0;
  else if (distance <= closeDist) buzzerPattern = 1;
  else if (distance <= mediumDist) buzzerPattern = 2;
  else if (distance <= farDist) buzzerPattern = 3;
  else buzzerPattern = 4;
}

// ================== GPS Processing ==================
void handleGPS() {
  while (SerialGPS.available() > 0) {
    gps.encode(SerialGPS.read());
  }
}

// ================== Send GPS Data to Supabase ==================
void sendToSupabase() {
  if (WiFi.status() != WL_CONNECTED) return;

  StaticJsonDocument<256> doc;
  doc["latitude"] = gps.location.lat();
  doc["longitude"] = gps.location.lng();
  doc["altitude"] = gps.altitude.meters();
  doc["speed"] = gps.speed.kmph();
  doc["course"] = gps.course.deg();
  doc["satellites"] = gps.satellites.value();
  doc["hdop"] = gps.hdop.hdop();

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

  HTTPClient http;
  http.begin(client, supabase_url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabase_key);
  http.addHeader("Authorization", String("Bearer ") + supabase_key);
  int code = http.POST(json);
  http.end();

  Serial.printf("POST %d\n", code);
}

// ================== Main Loop ==================
void loop() {
  unsigned long now = millis();

  // Periodic distance check
  if (now - lastDistanceMillis >= distanceInterval) {
    lastDistanceMillis = now;
    handleDistance();
  }

  // Buzzer runs continuously, state-based
  updateBuzzer();

  // GPS decode frequently
  if (now - lastGpsMillis >= gpsInterval) {
    lastGpsMillis = now;
    handleGPS();
  }

  // Periodic Supabase send
  if (gps.location.isUpdated() && (now - lastSendMillis >= sendInterval)) {
    lastSendMillis = now;
    sendToSupabase();
  }
}
