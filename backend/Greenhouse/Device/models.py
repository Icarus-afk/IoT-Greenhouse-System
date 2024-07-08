from django.db import models


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

class DeviceStatus(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    status = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Device Status"
        verbose_name_plural = "Device Statuses"

class HVACStatus(models.Model):
    device = models.ForeignKey(Device, on_delete=models.CASCADE)
    status = models.BooleanField()
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