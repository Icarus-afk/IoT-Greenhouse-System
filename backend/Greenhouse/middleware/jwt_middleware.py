# middleware/jwt_middleware.py

from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.contrib.auth.models import User
from utils.jwt_utils import decode_jwt

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        print(request)
        auth_header = request.META.get('HTTP_AUTHORIZATION', '').split()
        if len(auth_header) == 2 and auth_header[0].lower() == 'bearer':
            token = auth_header[1]
            payload = decode_jwt(token)
            if payload:
                user_id = payload.get('user_id')
                try:
                    user = User.objects.get(id=user_id)
                    request.user = user
                except User.DoesNotExist:
                    request.user = None
        else:
            request.user = None