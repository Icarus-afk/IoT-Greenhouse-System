# utils/jwt_utils.py

from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.settings import api_settings

def decode_jwt(token):
    try:
        UntypedToken(token)
        return api_settings.AUTH_TOKEN_CLASSES[0](token).payload
    except InvalidToken:
        return None
