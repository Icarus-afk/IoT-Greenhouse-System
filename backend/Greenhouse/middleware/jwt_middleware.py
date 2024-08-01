# middleware/jwt_middleware.py

from django.utils.deprecation import MiddlewareMixin
from django.urls import resolve
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from django.contrib.auth import get_user_model
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # Skip JWT authentication for admin panel requests
        if request.path.startswith('/admin/'):
            logger.debug("Skipping JWT authentication for admin panel")
            return
        
        auth_header = request.META.get('HTTP_AUTHORIZATION', '').split()
        logger.debug(f"Auth Header: {auth_header}")
        
        if len(auth_header) == 2 and auth_header[0].lower() == 'bearer':
            token = auth_header[1]
            try:
                validated_token = JWTAuthentication().get_validated_token(token)
                user = JWTAuthentication().get_user(validated_token)
                if user and user.is_active:
                    request.user = user
                    logger.debug(f"Authenticated User: {user}")
                else:
                    request.user = None
                    logger.debug("User is inactive or does not exist")
            except InvalidToken as e:
                request.user = None
                logger.debug(f"Invalid token: {e}")
        else:
            request.user = None
            logger.debug("No auth header found")
