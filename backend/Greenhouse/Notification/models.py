from django.db import models
from User.models import User
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

WARNING_LEVEL_CHOICES = [
    ('Low', 'Low'),
    ('Good', 'Good'),
    ('High', 'High'),
]

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    warning_level = models.CharField(max_length=10, choices=WARNING_LEVEL_CHOICES, default='Low')
    timestamp = models.DateTimeField(auto_now_add=True)
    device = models.ForeignKey('Device.Device', on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"

    def __str__(self):
        return f"{self.user.username} - {self.message[:50]}..."

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notification_{self.user.id}',
            {
                'type': 'notification_message',
                'message': self.message
            }
        )
