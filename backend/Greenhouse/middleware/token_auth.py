import os
import jwt
from django.conf import settings
from rest_framework_simplejwt.exceptions import InvalidToken
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async

@database_sync_to_async
def validate_jwt_token(jwt_token):
    try:
        decoded_token = jwt.decode(jwt_token, os.getenv('JWT_SECRET_KEY'), algorithms=['HS256'])
        print(f"Decoded Token: {decoded_token}")  # Debug statement to print the decoded token
        user_id = decoded_token['user_id']
        user = get_user_model().objects.get(id=user_id)
        print(f"User found: {user}")  # Debug statement to print the user
        return user
    except InvalidToken as e:
        print(f"InvalidToken Exception: {e}")  # Debug statement for InvalidToken exception
        return None
    except jwt.ExpiredSignatureError as e:
        print(f"ExpiredSignatureError: {e}")  # Debug statement for expired signature
        return None
    except jwt.DecodeError as e:
        print(f"DecodeError: {e}")  # Debug statement for decode error
        return None
    except jwt.InvalidTokenError as e:
        print(f"InvalidTokenError: {e}")  # Debug statement for invalid token error
        return None
    except get_user_model().DoesNotExist as e:
        print(f"User DoesNotExist: {e}")  # Debug statement for user not found
        return None