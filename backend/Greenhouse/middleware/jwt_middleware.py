# middleware/jwt_middleware.py

from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.contrib.auth.models import User
from utils.jwt_utils import decode_jwt
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.tokens import AccessToken
import logging

logger = logging.getLogger(__name__)

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '').split()
        logger.debug(f"Auth Header: {auth_header}")

        if len(auth_header) == 2 and auth_header[0].lower() == 'bearer':
            token = auth_header[1]
            try:
                AccessToken(token)  # Ensure the token is an access token
                payload = decode_jwt(token)
                if payload:
                    user_id = payload.get('user_id')
                    try:
                        user = User.objects.get(id=user_id)
                        request.user = user
                        logger.debug(f"Authenticated User: {user}")
                    except User.DoesNotExist:
                        request.user = None
                        logger.debug("User does not exist")
            except InvalidToken as e:
                request.user = None
                logger.debug(f"Invalid token: {e}")
        else:
            request.user = None
            logger.debug("No auth header found")
