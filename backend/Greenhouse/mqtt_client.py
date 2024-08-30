import os
import time
import django
import json
import threading
import logging
import paho.mqtt.client as mqtt
from datetime import datetime, timedelta
from django.utils import timezone

# Set up Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Greenhouse.settings")
django.setup()

from Device.models import Device, SensorData, DeviceStatus, HVACStatus, Greenhouse
from Notification.models import Notification
from Config.models import CropConfig, NotificationConfig

# Set up logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# MQTT settings
BROKER = "broker.emqx.io"
PORT = 1883
DATA_TOPIC = "IoT/Device/Data"
STATUS_TOPIC = "IoT/Device/Status"
HVAC_TOPIC = "IoT/Device/HVAC"

# Helper function to determine warning level based on thresholds
def get_warning_level(value, crop_config):
    try:
        value = float(value)
        high_min = float(crop_config.high_min)
        high_max = float(crop_config.high_max)
        tolerable_min = float(crop_config.tolerable_min)
        tolerable_max = float(crop_config.tolerable_max)
        low_min = float(crop_config.low_min)
        low_max = float(crop_config.low_max)
    except ValueError as e:
        logger.error(f"Error converting crop configuration to float: {e}")
        return None

    logger.debug(f"Value: {value}, High Min: {high_min}, High Max: {high_max}, "
                 f"Tolerable Min: {tolerable_min}, Tolerable Max: {tolerable_max}, "
                 f"Low Min: {low_min}, Low Max: {low_max}")

    if high_min <= value <= high_max:
        return "High"
    elif tolerable_min <= value <= tolerable_max:
        return "Good"
    elif low_min <= value <= low_max:
        return "Low"
    return None


# Helper function to check and insert a notification if needed
def check_and_notify(device, parameter, value):
    logger.debug(f"Checking and notifying for device: {device.device_id}, parameter: {parameter}, value: {value}")
    try:
        greenhouse = Greenhouse.objects.get(device=device)
        logger.debug(f"Greenhouse obtained: {greenhouse.id}")
        crop_config = CropConfig.objects.get(crop=greenhouse.crop, parameter=parameter)
        logger.debug(f"Crop configuration obtained: {crop_config.id}")
        
        # Convert the value to a float if it's a string
        if isinstance(value, str):
            value = float(value)
    except (Greenhouse.DoesNotExist, CropConfig.DoesNotExist, ValueError) as e:
        logger.error(f"No greenhouse, crop configuration found, or invalid value for device: {device.device_id} and parameter: {parameter}")
        logger.debug(f"Error: {e}")
        return

    warning_level = get_warning_level(value, crop_config)
    logger.debug(f"Warning level: {warning_level}")
    
    if warning_level is None:
        message = f"Invalid value provided by the device {device.name}. Please check your device."
        for user in greenhouse.users.all():
            Notification.objects.create(user=user, message=message, warning_level='Unknown', device=device)
        logger.info(f"Notification created for device: {device.name}, {message}")
        return
    
    last_notification = Notification.objects.filter(user__in=greenhouse.users.all(), message__contains=parameter).order_by('-timestamp').first()
    logger.debug(f"Last notification: {last_notification}")
    
    if not last_notification or last_notification.warning_level != warning_level:
        message_bit = NotificationConfig.objects.get(warning_level=warning_level, parameter=parameter)
        message = f"{message_bit.message} device {device.name}, {parameter} level is {value}"
        for user in greenhouse.users.all():
            Notification.objects.create(user=user, message=message, warning_level=warning_level, device=device)
        logger.info(f"Notification created for device: {device.name}, {message}")
    else:
        logger.info(f"No new notification needed for device: {device.name}, parameter: {parameter}")

# MQTT on_connect callback
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logger.info("Connected to MQTT Broker!")
        client.subscribe(DATA_TOPIC)
        client.subscribe(STATUS_TOPIC)
        client.subscribe(HVAC_TOPIC)
    else:
        logger.error(f"Failed to connect, return code {rc}")

# MQTT on_message callback
def on_message(client, userdata, msg):
    logger.debug(f"Received a message on topic: {msg.topic}")
    topic = msg.topic
    payload = json.loads(msg.payload.decode())
    timestamp = timezone.now()

    try:
        device, created = Device.objects.get_or_create(device_id=payload["device_id"])
        logger.debug(f"Device obtained or created: {device.device_id}")
        
        # Update the last seen timestamp
        device.last_seen = timestamp
        device.is_online = True
        device.save()
        logger.debug(f"Device last seen timestamp updated: {device.last_seen}")

        if topic == DATA_TOPIC:
            # Convert string values to float if needed
            temperature = float(payload.get("temperature", 0))
            humidity = float(payload.get("humidity", 0))
            soil_moisture = float(payload.get("soil_moisture", 0))
            rain_level = float(payload.get("rain_level", 0))
            light_lux = float(payload.get("light_lux", 0))

            SensorData.objects.create(
                device=device,
                temperature=temperature,
                humidity=humidity,
                soil_moisture=soil_moisture,
                rain_level=rain_level,
                light_lux=light_lux,
                timestamp=timestamp
            )
            logger.info(f"Sensor data saved for device: {device.device_id}")
            logger.debug(f"Sensor data: {payload}")
            
            # Check and notify for each parameter
            check_and_notify(device, "Temperature", temperature)
            check_and_notify(device, "Humidity", humidity)
            check_and_notify(device, "Soil Moisture", soil_moisture)
            check_and_notify(device, "Rainfall", rain_level)
            check_and_notify(device, "Light Intensity", light_lux)
        
        elif topic == STATUS_TOPIC:
            DeviceStatus.objects.create(
                device=device,
                status=payload["status"],
                timestamp=timestamp
            )
            logger.info(f"Device status saved for device: {device.name}")
            logger.debug(f"Device status: {payload['status']}")
        elif topic == HVAC_TOPIC:
            HVACStatus.objects.create(
                device=device,
                status=payload["fan_status"],
                timestamp=timestamp
            )
            logger.info(f"HVAC status saved for device: {device.name}")
            logger.debug(f"HVAC status: {payload['fan_status']}")
    except Exception as e:
        logger.error(f"Error saving data: {e}")
        logger.debug(f"Payload: {payload}")

# Start the MQTT client
def start_mqtt_client():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(BROKER, PORT, 60)
    client.loop_forever()

# Function to periodically check for offline devices
def check_offline_devices():
    while True:
        offline_threshold = timezone.now() - timedelta(minutes=1)
        offline_devices = Device.objects.filter(last_seen__lt=offline_threshold, is_online=True)
        for device in offline_devices:
            device.is_online = False
            device.save()
            logger.info(f"Device marked as offline: {device.name}")
        
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    mqtt_thread = threading.Thread(target=start_mqtt_client)
    mqtt_thread.start()
    
    offline_check_thread = threading.Thread(target=check_offline_devices)
    offline_check_thread.start()

    mqtt_thread.join()
    offline_check_thread.join()
