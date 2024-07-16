from django.urls import re_path
from Notification import consumers as notification_consumers
from Device import consumers as device_consumers

websocket_urlpatterns = [
    re_path(r'^ws/notifications/$', notification_consumers.NotificationConsumer.as_asgi()),
    re_path(r'^ws/sensor_data/$', device_consumers.SensorDataConsumer.as_asgi()),
    re_path(r'^ws/device_status/$', device_consumers.DeviceStatusConsumer.as_asgi()),
]
