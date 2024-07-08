from django.contrib import admin
from .models import NotificationConfig, Crop, CropConfig

@admin.register(NotificationConfig)
class NotificationConfigAdmin(admin.ModelAdmin):
    list_display = ('message', 'warning_level', 'timestamp', 'color', 'parameter')
    list_filter = ('warning_level',)
    search_fields = ('message',)

@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(CropConfig)
class CropConfigAdmin(admin.ModelAdmin):
    list_display = ('crop', 'parameter', 'high_min', 'high_max', 'tolerable_min', 'tolerable_max', 'low_min', 'low_max')
    list_filter = ('crop', 'parameter')
    search_fields = ('crop__name', 'parameter')
