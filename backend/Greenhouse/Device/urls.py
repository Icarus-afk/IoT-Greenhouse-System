from django.urls import path
from .views import DeviceDataView, DeviceStatusView, GreenhouseListView

urlpatterns = [
    path('data/', DeviceDataView.as_view(), name='device-data'),
    path('status/', DeviceStatusView.as_view(), name='device-status'),
    path('device/', GreenhouseListView.as_view(), name='device-list'),
]

