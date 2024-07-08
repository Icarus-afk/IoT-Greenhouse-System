from rest_framework import generics
from .models import Device, Greenhouse, SensorData, DeviceStatus
from .serializers import DeviceSerializer, SensorDataSerializer, DeviceStatusSerializer
from Config.response import create_response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError
from django.db.models import Q, Max
from django_filters import rest_framework as filters
from rest_framework.response import Response



class DeviceDataPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

class DeviceDataView(generics.ListAPIView):
    serializer_class = SensorDataSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['timestamp', 'device__device_id', 'temperature', 'humidity', 'soil_moisture', 'rain_level', 'light_lux']
    pagination_class = DeviceDataPagination

    def get_queryset(self):
        user = self.request.user
        greenhouses = Greenhouse.objects.filter(users=user)
        devices = Device.objects.filter(greenhouse__in=greenhouses)
        return SensorData.objects.filter(device__in=devices)

    def list(self, request, *args, **kwargs):
        try:
            response = super().list(request, *args, **kwargs)
            return create_response(data=response.data, message="Device data fetched successfully", status_code=200)
        except ValidationError as e:
            return create_response(data=str(e), message="Validation error", status_code=400)
        except Exception as e:
            return create_response(data=str(e), message="An error occurred", status_code=500)


class DeviceStatusFilter(filters.FilterSet):
    device_id = filters.CharFilter(field_name='device__device_id')
    status = filters.CharFilter(field_name='status')

    class Meta:
        model = DeviceStatus
        fields = ['device_id', 'status']

class DeviceStatusView(generics.ListAPIView):
    serializer_class = DeviceStatusSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = DeviceStatusFilter

    def get_queryset(self):
        user = self.request.user
        greenhouses = Greenhouse.objects.filter(users=user)
        devices = Device.objects.filter(greenhouse__in=greenhouses)

        # Get the latest DeviceStatus for each Device
        latest_statuses = devices.annotate(
            latest_status_id=Max('devicestatus__id')
        ).values_list('latest_status_id', flat=True)

        return DeviceStatus.objects.filter(id__in=latest_statuses)

    def list(self, request, *args, **kwargs):
        try:
            response = super().list(request, *args, **kwargs)
            return create_response(data=response.data, message="Device status fetched successfully", status_code=200)
        except ValidationError as e:
            return create_response(data=str(e), message="Validation error", status_code=400)
        except Exception as e:
            return create_response(data=str(e), message="An error occurred", status_code=500)