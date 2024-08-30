from rest_framework import generics
from .models import Device, Greenhouse, SensorData, DeviceStatus
from .serializers import DeviceSerializer, GreenhouseSerializer, SensorDataSerializer, DeviceStatusSerializer
from Config.response import create_response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError
from django.db.models import Q, Max
from django_filters import rest_framework as filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.dateparse import parse_date
import logging
from django.utils.timezone import make_aware, now
from datetime import datetime, time


logger = logging.getLogger(__name__)

class DeviceDataPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 10000


class DeviceDataView(generics.ListAPIView):
    serializer_class = SensorDataSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = []  # No need for filterset_fields since we are manually filtering
    pagination_class = DeviceDataPagination

    def get_queryset(self):
        user = self.request.user
        greenhouses = Greenhouse.objects.filter(users=user)
        devices = Device.objects.filter(greenhouse__in=greenhouses)
        queryset = SensorData.objects.filter(device__in=devices).order_by('timestamp')
        
        logger.debug(f"Initial queryset count: {queryset.count()}")
        
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        device_id = self.request.query_params.get('device_id', None)
        
        logger.debug(f"Start date: {start_date}, End date: {end_date}, Device ID: {device_id}")
        
        if start_date:
            parsed_start_date = parse_date(start_date)
            if parsed_start_date:
                parsed_start_date = make_aware(datetime.combine(parsed_start_date, datetime.min.time()), timezone=now().tzinfo)
                logger.debug(f"Parsed start date: {parsed_start_date}")
                queryset = queryset.filter(timestamp__gte=parsed_start_date)
                logger.debug(f"Queryset count after start date filter: {queryset.count()}")
            else:
                logger.error(f"Failed to parse start date: {start_date}")
        
        if end_date:
            parsed_end_date = parse_date(end_date)
            if parsed_end_date:
                parsed_end_date = make_aware(datetime.combine(parsed_end_date, datetime.max.time()), timezone=now().tzinfo)
                logger.debug(f"Parsed end date: {parsed_end_date}")
                queryset = queryset.filter(timestamp__lte=parsed_end_date)
                logger.debug(f"Queryset count after end date filter: {queryset.count()}")
            else:
                logger.error(f"Failed to parse end date: {end_date}")
        
        if device_id:
            queryset = queryset.filter(device_id=device_id)
            logger.debug(f"Queryset count after device ID filter: {queryset.count()}")
        
        return queryset

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
        
        
        
class GreenhouseListView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            user = request.user
            # Find greenhouses the user has access to
            greenhouses = Greenhouse.objects.filter(users=user)
            # Prefetch related devices and crops
            greenhouses = greenhouses.select_related('device', 'crop')
            # Serialize the greenhouses along with their devices and crops
            serializer = GreenhouseSerializer(greenhouses, many=True)
            return Response({
                "statusCode": 200,
                "message": "Greenhouses and their devices fetched successfully",
                "success": True,
                "data": serializer.data
            })
        except Exception as e:
            return Response({
                "statusCode": 500,
                "message": "An error occurred",
                "success": False,
                "data": str(e)
            })