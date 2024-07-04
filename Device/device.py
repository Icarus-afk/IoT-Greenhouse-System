import threading
import time
import random
import json
import paho.mqtt.client as mqtt
import logging
import colorlog

# Device ID
DEVICE_ID = "441801"

# MQTT Topics
DATA_TOPIC = "IoT/Device/Data"
STATUS_TOPIC = "IoT/Device/Status"

# MQTT Broker settings
BROKER = "broker.hivemq.com"
PORT = 1883

# Create a logger object
logger = colorlog.getLogger()
logger.setLevel(logging.DEBUG)

# Add color to logging output
handler = logging.StreamHandler()
handler.setFormatter(colorlog.ColoredFormatter(
    '%(log_color)s%(levelname)s: %(message)s',
    log_colors={
        'DEBUG': 'cyan',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'red,bg_white',
    },
))

logger.addHandler(handler)

# Simulate sensor data
def get_sensor_data():
    return {
        "device_id": DEVICE_ID,
        "temperature": round(random.uniform(15.0, 45.0), 2),  # Simulate temperature in °C
        "humidity": round(random.uniform(30.0, 90.0), 2),     # Simulate humidity in %
        "soil_moisture": round(random.uniform(0.0, 100.0), 2),# Simulate soil moisture in %
        "rain_level": round(random.uniform(0.0, 50.0), 2),    # Simulate rain level in mm
        "light_lux": round(random.uniform(100.0, 1000.0), 2)  # Simulate light intensity in lux
    }

# Function to publish sensor data
def publish_data(client):
    while True:
        sensor_data = get_sensor_data()
        logger.debug(f"Publishing sensor data: {sensor_data}")
        client.publish(DATA_TOPIC, json.dumps(sensor_data))
        time.sleep(30)  # Send data every 5 seconds

# Function to publish device status
def publish_status(client):
    while True:
        status_message = {
            "device_id": DEVICE_ID,
            "status": 1  # 1 means the device is online
        }
        logger.debug(f"Publishing device status: {status_message}")
        client.publish(STATUS_TOPIC, json.dumps(status_message))
        time.sleep(10)  # Send status every 10 seconds

# MQTT on_connect callback
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logger.info("Connected to MQTT Broker!")
    else:
        logger.error("Failed to connect, return code %d\n", rc)

def main():
    # Create MQTT client
    client = mqtt.Client()

    # Assign on_connect callback
    client.on_connect = on_connect

    # Connect to MQTT Broker
    client.connect(BROKER, PORT, 60)

    # Start the MQTT loop
    client.loop_start()

    # Start the data publishing thread
    data_thread = threading.Thread(target=publish_data, args=(client,))
    data_thread.start()

    # Start the status publishing thread
    status_thread = threading.Thread(target=publish_status, args=(client,))
    status_thread.start()

    # Keep the main thread running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Exiting...")
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main()