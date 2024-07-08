from django.urls import path
from .views import DeviceDataView, DeviceStatusView

urlpatterns = [
    path('data/', DeviceDataView.as_view(), name='device-data'),
    path('status/', DeviceStatusView.as_view(), name='device-status'),
]

