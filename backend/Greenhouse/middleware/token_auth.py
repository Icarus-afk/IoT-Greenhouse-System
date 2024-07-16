import jwt
from django.conf import settings
from rest_framework_simplejwt.exceptions import InvalidToken
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async

@database_sync_to_async
def validate_jwt_token(jwt_token):
    try:
        decoded_token = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = decoded_token['user_id']
        user = get_user_model().objects.get(id=user_id)
        return user
    except InvalidToken:
        return None
    except (jwt.ExpiredSignatureError, jwt.DecodeError, jwt.InvalidTokenError):
        return None
    except get_user_model().DoesNotExist:
        return None
