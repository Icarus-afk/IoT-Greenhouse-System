# In your_app/management/commands/populate_notification_config.py

from django.core.management.base import BaseCommand
from django.utils import timezone
from Config.models import NotificationConfig

class Command(BaseCommand):
    help = 'Populates the database with initial notification configurations'

    def handle(self, *args, **options):
        notification_data = [
            # Temperature notifications
            {
                "message": "High temperature detected.",
                "warning_level": "High",
                "color": "red",
                "parameter": "Temperature"
            },
            {
                "message": "Low temperature detected.",
                "warning_level": "Low",
                "color": "blue"
                "parameter": "Temperature"
            },
            {
                "message": "Optimal temperature range.",
                "warning_level": "Good",
                "color": "green"
                "parameter": "Temperature"
            },

            # Humidity notifications
            {
                "message": "High humidity level detected.",
                "warning_level": "High",
                "color": "red"
            },
            {
                "message": "Low humidity level detected.",
                "warning_level": "Low",
                "color": "blue"
            },
            {
                "message": "Optimal humidity range.",
                "warning_level": "Good",
                "color": "green"
            },

            # Soil moisture notifications
            {
                "message": "High soil moisture level detected.",
                "warning_level": "High",
                "color": "red"
            },
            {
                "message": "Low soil moisture level detected.",
                "warning_level": "Low",
                "color": "blue"
            },
            {
                "message": "Optimal soil moisture range.",
                "warning_level": "Good",
                "color": "green"
            },

            # Rainfall notifications
            {
                "message": "Heavy rainfall detected.",
                "warning_level": "High",
                "color": "red"
            },
            {
                "message": "No rainfall detected.",
                "warning_level": "Low",
                "color": "blue"
            },
            {
                "message": "Optimal rainfall range.",
                "warning_level": "Good",
                "color": "green"
            },

            # Light intensity notifications
            {
                "message": "High light intensity detected.",
                "warning_level": "High",
                "color": "red"
            },
            {
                "message": "Low light intensity detected.",
                "warning_level": "Low",
                "color": "blue"
            },
            {
                "message": "Optimal light intensity range.",
                "warning_level": "Good",
                "color": "green"
            },
        ]

        for data in notification_data:
            NotificationConfig.objects.create(
                message=data["message"],
                warning_level=data["warning_level"],
                color=data["color"],
                timestamp=timezone.now()
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated notification configurations'))
