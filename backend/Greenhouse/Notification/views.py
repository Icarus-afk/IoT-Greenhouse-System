from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError
from django_filters import rest_framework as filters
from rest_framework.response import Response

from .models import Notification
from .serializers import NotificationSerializer
from Config.response import create_response

class NotificationPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class NotificationFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name="timestamp", lookup_expr='gte')
    end_date = filters.DateFilter(field_name="timestamp", lookup_expr='lte')
    warning_level = filters.CharFilter(field_name='warning_level')
    device_id = filters.CharFilter(field_name='device__device_id')

    class Meta:
        model = Notification
        fields = ['start_date', 'end_date', 'warning_level', 'device_id']

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = NotificationFilter
    pagination_class = NotificationPagination

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(user=user).order_by('-timestamp')

    def list(self, request, *args, **kwargs):
        try:
            response = super().list(request, *args, **kwargs)
            return create_response(data=response.data, message="Notifications fetched successfully", status_code=200)
        except ValidationError as e:
            return create_response(data=str(e), message="Validation error", status_code=400)
        except Exception as e:
            return create_response(data=str(e), message="An error occurred", status_code=500)
