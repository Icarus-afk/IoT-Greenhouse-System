from django.urls import path
from .views import NotificationListView

urlpatterns = [
    path('get/', NotificationListView.as_view(), name='notification-list'),
]
