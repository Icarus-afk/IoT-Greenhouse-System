from rest_framework import serializers
from .models import Device, SensorData, DeviceStatus
from datetime import timedelta
from django.utils import timezone



class DeviceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Device
        fields = '__all__'


class SensorDataSerializer(serializers.ModelSerializer):
    device_id = serializers.CharField(source='device.device_id')

    class Meta:
        model = SensorData
        fields = ['device_id', 'timestamp', 'temperature', 'humidity', 'soil_moisture', 'rain_level', 'light_lux']


class DeviceStatusSerializer(serializers.ModelSerializer):
    device_name = serializers.CharField(source='device.name', read_only=True)
    device_location = serializers.CharField(source='device.location', read_only=True)
    is_online = serializers.SerializerMethodField()

    class Meta:
        model = DeviceStatus
        fields = ['device_name', 'device_location', 'device', 'status', 'timestamp', 'is_online']

    def get_is_online(self, obj):
       return timezone.now() - obj.device.last_seen < timedelta(minutes=5)