from django.utils.timezone import make_aware, now, get_current_timezone
from django.utils.dateparse import parse_date
from Config.response import create_response
from Device.models import Device, Greenhouse
from Notification.serializers import NotificationSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from .models import Notification
import logging
from datetime import datetime, time, timedelta
from rest_framework.exceptions import ValidationError

logger = logging.getLogger(__name__)

class NotificationPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 10000

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = []  # No need for filterset_fields since we are manually filtering
    pagination_class = NotificationPagination

    def get_queryset(self):
        user = self.request.user
        greenhouses = Greenhouse.objects.filter(users=user)
        devices = Device.objects.filter(greenhouse__in=greenhouses)
        queryset = Notification.objects.filter(device__in=devices).order_by('-timestamp')  # Order by date descending
        
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
            return create_response(data=response.data, message="Notifications retrieved successfully", status_code=200)
        except ValidationError as e:
            return create_response(data=str(e), message="Validation error", status_code=400)
        except Exception as e:
            return create_response(data=str(e), message="An error occurred", status_code=500)