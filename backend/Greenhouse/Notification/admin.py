from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'message', 'warning_level', 'timestamp')
    list_filter = ('warning_level', 'timestamp')
    search_fields = ('user__username', 'message')