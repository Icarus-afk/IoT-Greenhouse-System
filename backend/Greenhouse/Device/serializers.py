from Config.models import Crop
from rest_framework import serializers
from .models import Device, SensorData, DeviceStatus, Greenhouse
from datetime import timedelta
from django.utils import timezone


class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = ['id', 'device_id', 'name', 'location', 'timestamp', 'last_seen', 'is_online']

class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = ['id', 'name']

class GreenhouseSerializer(serializers.ModelSerializer):
    device = DeviceSerializer(read_only=True)
    crop = CropSerializer(read_only=True)

    class Meta:
        model = Greenhouse
        fields = ['id', 'name', 'location', 'timestamp', 'device', 'crop']

class SensorDataSerializer(serializers.ModelSerializer):
    device_id = serializers.CharField(source='device.device_id')
    device_name = serializers.CharField(source='device.name')

    class Meta:
        model = SensorData
        fields = ['device_id', 'device_name', 'timestamp', 'temperature', 'humidity', 'soil_moisture', 'rain_level', 'light_lux']


class DeviceStatusSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.name', read_only=True)
    device_location = serializers.CharField(source='device.location', read_only=True)
    is_online = serializers.SerializerMethodField()

    class Meta:
        model = DeviceStatus
        fields = ['device_name', 'device_location', 'device', 'status', 'timestamp', 'is_online']

    def get_is_online(self, obj):
       return timezone.now() - obj.device.last_seen < timedelta(minutes=5)