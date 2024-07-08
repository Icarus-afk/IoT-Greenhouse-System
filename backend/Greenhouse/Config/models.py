from django.db import models
from Device.models import Device

# Create your models here.
class NotificationConfig(models.Model):
    message = models.TextField(null=True, blank=True)
    warning_level = models.CharField(max_length=30, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    color = models.CharField(max_length=30, null=True, blank=True)
    PARAMETER_CHOICES = [
        ('Temperature', 'Temperature'),
        ('Humidity', 'Humidity'),
        ('Soil Moisture', 'Soil Moisture'),
        ('Rainfall', 'Rainfall'),
        ('Light Intensity', 'Light Intensity'),
    ]
    parameter = models.CharField(max_length=50, choices=PARAMETER_CHOICES, null=True, blank=True)

    
    
class Crop(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class CropConfig(models.Model):
    PARAMETER_CHOICES = [
        ('Temperature', 'Temperature'),
        ('Humidity', 'Humidity'),
        ('Soil Moisture', 'Soil Moisture'),
        ('Rainfall', 'Rainfall'),
        ('Light Intensity', 'Light Intensity'),
    ]

    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)
    parameter = models.CharField(max_length=50, choices=PARAMETER_CHOICES)
    high_min = models.FloatField()
    high_max = models.FloatField()
    tolerable_min = models.FloatField()
    tolerable_max = models.FloatField()
    low_min = models.FloatField()
    low_max = models.FloatField()

    class Meta:
        verbose_name = "Crop Config"
        verbose_name_plural = "Crop Config"
        unique_together = ('crop', 'parameter')

    def __str__(self):
        return f"{self.crop.name} - {self.parameter}"