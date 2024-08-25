#include <Wire.h>
#include <GyverHTU21D.h>
#include <BH1750FVI.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>

// Sensor and device configuration
#define AOUT_PIN 34 // Analog pin for Soil Moisture Sensor
#define rainAnalog 35 // Analog pin for Rain Sensor
#define FAN_PIN 14 // GPIO pin for controlling the fan
#define DATA_LED_PIN 2
#define STATUS_LED_PIN 5

// WiFi credentials
const char* ssid = "Ahad";
const char* password = "abiba0206";

// MQTT broker info
const char* mqtt_broker = "broker.emqx.io";
const int mqtt_port = 1883;
const char* mqtt_topic_data = "IoT/Device/Data";
const char* mqtt_topic_hvac = "IoT/Device/HVAC";
const char* mqtt_topic_status = "IoT/Device/Status";

// Device ID
const int device_id = 441801;

WiFiClient espClient;
PubSubClient client(espClient);

// I2C instance for default ports (SDA on GPIO 21 and SCL on GPIO 22)
TwoWire I2C_DEFAULT = Wire; 

GyverHTU21D htu;
BH1750FVI lightmeter(0x23, &I2C_DEFAULT); // Pass reference to I2C_DEFAULT

void setup() {
  pinMode(DATA_LED_PIN, OUTPUT);
  pinMode(STATUS_LED_PIN, OUTPUT);
  Serial.begin(115200);
  Serial.println("Starting setup...");

  pinMode(FAN_PIN, OUTPUT);
  digitalWrite(FAN_PIN, LOW); // Ensure the fan is initially off

  // Initialize I2C on GPIO 21 (SDA) and GPIO 22 (SCL)
  I2C_DEFAULT.begin(21, 22, 100000);
  
  htu.begin(); // Initialize HTU21D sensor
  lightmeter.powerOn();
  lightmeter.setContHighRes();

  setupWiFi();
  client.setServer(mqtt_broker, mqtt_port);
  client.setCallback(callback);
  connectMQTT();

  Serial.println("Setup complete");

  // Create tasks
  xTaskCreate(sendDataTask, "Send Data Task", 10000, NULL, 1, NULL);
  xTaskCreate(sendStatusTask, "Send Status Task", 10000, NULL, 1, NULL);
  xTaskCreate(listenHVACTask, "Listen HVAC Task", 10000, NULL, 1, NULL);
}

void loop() {
  // Empty. All tasks are managed by FreeRTOS.
}

void sendDataTask(void * parameter) {
  for (;;) {
    if (client.connected()) {
      digitalWrite(DATA_LED_PIN, HIGH);  // Turn on data LED
      sendData();
      digitalWrite(DATA_LED_PIN, LOW);  // Turn off data LED
    }
    vTaskDelay(5000 / portTICK_PERIOD_MS);  // Delay for 5 seconds
  }
}

void sendStatusTask(void * parameter) {
  for (;;) {
    if (client.connected()) {
      digitalWrite(STATUS_LED_PIN, HIGH);  // Turn on status LED
      sendStatus("online");
      digitalWrite(STATUS_LED_PIN, LOW);  // Turn off status LED
    }
    vTaskDelay(5000 / portTICK_PERIOD_MS);  // Delay for 5 seconds
  }
}

void listenHVACTask(void * parameter) {
  for (;;) {
    if (!client.connected()) {
      reconnectMQTT();
    }
    client.loop();
    vTaskDelay(100 / portTICK_PERIOD_MS);  // Delay for 100 milliseconds
  }
}

void setupWiFi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void connectMQTT() {
  Serial.println("Connecting to MQTT broker...");
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    String clientId = "ESP32Client-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("Connected to MQTT broker");
      if (client.subscribe(mqtt_topic_hvac)) {
        Serial.println("Subscribed to topic: " + String(mqtt_topic_hvac));
      } else {
        Serial.println("Failed to subscribe to topic: " + String(mqtt_topic_hvac));
      }
      sendStatus("on");
    } else {
      Serial.print("failed with state ");
      Serial.println(client.state());
      delay(2000);
    }
  }
}

void reconnectMQTT() {
  while (!client.connected()) {
    connectMQTT();
  }
}

void sendData() {
  Serial.println("Reading sensor data...");

  // Read data from HTU21D sensor
  float temperature = htu.getTemperature();
  float humidity = htu.getHumidity();

  // Read data from other sensors
  int soilMoisture = analogRead(AOUT_PIN);
  soilMoisture = constrain(soilMoisture, 1500, 4029);
  soilMoisture = map(soilMoisture, 1400, 4029, 100, 0);
  int rainLevel = analogRead(rainAnalog);
  rainLevel = constrain(rainLevel, 0, 4029);
  rainLevel = map(rainLevel, 0, 4029, 100, 0);
  float lightLux = lightmeter.getLux();

  Serial.print("Temperature: ");
  Serial.println(temperature);
  Serial.print("Humidity: ");
  Serial.println(humidity);
  Serial.print("Soil Moisture: ");
  Serial.println(soilMoisture);
  Serial.print("Rain Level: ");
  Serial.println(rainLevel);
  Serial.print("Light Lux: ");
  Serial.println(lightLux);

  StaticJsonDocument<200> doc;
  doc["device_id"] = device_id;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["soil_moisture"] = soilMoisture;
  doc["rain_level"] = rainLevel;
  doc["light_lux"] = lightLux;

  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  client.publish(mqtt_topic_data, jsonBuffer);

  Serial.print("Published data: ");
  serializeJson(doc, Serial);
  Serial.println();
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  char msg[length + 1];
  for (unsigned int i = 0; i < length; i++) {
    msg[i] = (char)payload[i];
  }
  msg[length] = '\0';
  Serial.println(msg);

  StaticJsonDocument<200> doc;
  DeserializationError error = deserializeJson(doc, msg);
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    return;
  }

  if (strcmp(topic, mqtt_topic_hvac) == 0) {
    if (doc["device_id"] == device_id) {
      const char* fan_status = doc["fan_status"];
      if (strcmp(fan_status, "on") == 0) {
        digitalWrite(FAN_PIN, HIGH);
        Serial.println("Fan turned ON");
      } else if (strcmp(fan_status, "off") == 0) {
        digitalWrite(FAN_PIN, LOW);
        Serial.println("Fan turned OFF");
      }
    }
  }
}

void sendStatus(const char* status) {
  StaticJsonDocument<200> doc;
  doc["device_id"] = device_id;
  doc["status"] = status;

  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  client.publish(mqtt_topic_status, jsonBuffer);

  Serial.print("Published status: ");
  serializeJson(doc, Serial);
  Serial.println();
}
