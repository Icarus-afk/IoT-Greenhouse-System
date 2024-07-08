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
BROKER = "broker.hivemq.com"
PORT = 1883
DATA_TOPIC = "IoT/Device/Data"
STATUS_TOPIC = "IoT/Device/Status"
HVAC_TOPIC = "IoT/Device/HVAC"

# Helper function to determine warning level based on thresholds
def get_warning_level(value, crop_config):
    if crop_config.high_min <= value <= crop_config.high_max:
        return "High"
    elif crop_config.tolerable_min <= value <= crop_config.tolerable_max:
        return "Good"
    elif crop_config.low_min <= value <= crop_config.low_max:
        return "Low"
    return None

# Helper function to check and insert a notification if needed
def check_and_notify(device, parameter, value):
    try:
        greenhouse = Greenhouse.objects.get(device=device)
        crop_config = CropConfig.objects.get(crop=greenhouse.crop, parameter=parameter)
    except (Greenhouse.DoesNotExist, CropConfig.DoesNotExist):
        logger.error(f"No greenhouse or crop configuration found for device: {device.device_id} and parameter: {parameter}")
        return

    warning_level = get_warning_level(value, crop_config)
    
    if warning_level is None:
        message = f"Invalid value provided by the device {device.name}. Please check your device."
        for user in greenhouse.users.all():
            Notification.objects.create(user=user, message=message, warning_level='Unknown', device=device)
        logger.info(f"Notification created for device: {device.name}, {message}")
        return
    
    last_notification = Notification.objects.filter(user__in=greenhouse.users.all(), message__contains=parameter).order_by('-timestamp').first()
    
    if not last_notification or last_notification.warning_level != warning_level:
        message_bit = NotificationConfig.objects.get(warning_level=warning_level, parameter=parameter)
        message = f"{message_bit.message} device {device.name}, {parameter} level is {value}"
        for user in greenhouse.users.all():
            Notification.objects.create(user=user, message=message, warning_level=warning_level)
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
    topic = msg.topic
    payload = json.loads(msg.payload.decode())
    timestamp = timezone.now()

    try:
        device, created = Device.objects.get_or_create(device_id=payload["device_id"])
        
        # Update the last seen timestamp
        device.last_seen = timestamp
        device.is_online = True
        device.save()

        if topic == DATA_TOPIC:
            SensorData.objects.create(
                device=device,
                temperature=payload["temperature"],
                humidity=payload["humidity"],
                soil_moisture=payload["soil_moisture"],
                rain_level=payload["rain_level"],
                light_lux=payload["light_lux"],
                timestamp=timestamp
            )
            logger.info(f"Sensor data saved for device: {device.device_id}")
            
            # Check and notify for each parameter
            check_and_notify(device, "Temperature", payload["temperature"])
            check_and_notify(device, "Humidity", payload["humidity"])
            check_and_notify(device, "Soil Moisture", payload["soil_moisture"])
            check_and_notify(device, "Rainfall", payload["rain_level"])
            check_and_notify(device, "Light Intensity", payload["light_lux"])
        
        elif topic == STATUS_TOPIC:
            DeviceStatus.objects.create(
                device=device,
                status=payload["status"],
                timestamp=timestamp
            )
            logger.info(f"Device status saved for device: {device.name}")
        elif topic == HVAC_TOPIC:
            HVACStatus.objects.create(
                device=device,
                status=payload["status"],
                timestamp=timestamp
            )
            logger.info(f"HVAC status saved for device: {device.name}")
    except Exception as e:
        logger.error(f"Error saving data: {e}")

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
