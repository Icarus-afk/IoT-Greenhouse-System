from django.contrib import admin
from .models import SensorData, DeviceStatus, HVACStatus, Device, Greenhouse



@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    list_display = ['device_id', 'name', 'location', 'timestamp', 'last_seen', 'is_online']
    readonly_fields = ['timestamp', 'last_seen']
    ordering = ['name']

@admin.register(SensorData)
class SensorDataAdmin(admin.ModelAdmin):
    list_display = ['device_name', 'temperature', 'humidity', 'soil_moisture', 'rain_level', 'light_lux', 'timestamp']
    readonly_fields = ['timestamp']
    
    def device_name(self, obj):
        return obj.device.name
    device_name.short_description = 'Device Name'  

@admin.register(DeviceStatus)
class DeviceStatusAdmin(admin.ModelAdmin):
    list_display = ['device_name', 'status', 'timestamp']
    readonly_fields = ['timestamp']

    def device_name(self, obj):
        return obj.device.name
    device_name.short_description = 'Device Name'  

@admin.register(HVACStatus)
class HVACStatusAdmin(admin.ModelAdmin):
    list_display = ['device_name', 'status', 'timestamp']
    readonly_fields = ['timestamp']
    
    def device_name(self, obj):
        return obj.device.name
    device_name.short_description = 'Device Name'  

@admin.register(Greenhouse)
class GreenhouseAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'timestamp', 'device', 'crop')
    list_filter = ('location', 'device', 'crop')
    search_fields = ('name', 'location')
    filter_horizontal = ('users',)
    readonly_fields = ['timestamp']
    ordering = ['name']