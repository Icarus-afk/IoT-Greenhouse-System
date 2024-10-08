from django.db import models
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


class Device(models.Model):
    device_id = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    last_seen = models.DateTimeField(null=True, blank=True)
    is_online = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Device"
        verbose_name_plural = "Devices"

class SensorData(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    temperature = models.FloatField()
    humidity = models.FloatField()
    soil_moisture = models.FloatField()
    rain_level = models.FloatField()
    light_lux = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Sensor Data"
        verbose_name_plural = "Sensor Data"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        channel_layer = get_channel_layer()
        greenhouse = Greenhouse.objects.get(device=self.device)
        for user in greenhouse.users.all():
            async_to_sync(channel_layer.group_send)(
                f'sensor_data_{user.id}',
                {
                    'type': 'sensor_data_message',
                    'message': {
                        'temperature': self.temperature,
                        'humidity': self.humidity,
                        'soil_moisture': self.soil_moisture,
                        'rain_level': self.rain_level,
                        'light_lux': self.light_lux,
                    },
                    'device_id': self.device.device_id if self.device else 'Unknown'
                }
            )
            print(f"Sent sensor data message to sensor_data_{user.id}: {self.temperature}, {self.humidity}, {self.soil_moisture}, {self.rain_level}, {self.light_lux}, Device ID: {self.device.device_id if self.device else 'Unknown'}")

    def __str__(self):
        return (f"SensorData(id={self.id}, timestamp={self.timestamp}, temperature={self.temperature}, "
                f"humidity={self.humidity}, soil_moisture={self.soil_moisture}, rain_level={self.rain_level}, "
                f"light_lux={self.light_lux}, device_id={self.device.device_id if self.device else 'Unknown'})")
        
    
class DeviceStatus(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Device Status"
        verbose_name_plural = "Device Statuses"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        channel_layer = get_channel_layer()
        greenhouse = Greenhouse.objects.get(device=self.device)
        for user in greenhouse.users.all():
            async_to_sync(channel_layer.group_send)(
                f'device_status_{user.id}',
                {
                    'type': 'device_status_message',
                    'message': f'New device status: {self.status}'
                }
            )

class HVACStatus(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "HVAC Status"
        verbose_name_plural = "HVAC Statuses"
        
        
class Greenhouse(models.Model):
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)
    device = models.ForeignKey('Device', on_delete=models.CASCADE, null=True, blank=True)
    crop = models.ForeignKey('Config.Crop', on_delete=models.CASCADE, null=True, blank=True)
    users = models.ManyToManyField('User.User', blank=True)
    
    class Meta:
        verbose_name = "Greenhouse"
        verbose_name_plural = "Greenhouses"