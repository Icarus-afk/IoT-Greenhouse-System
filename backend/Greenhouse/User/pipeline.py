from rest_framework_simplejwt.tokens import RefreshToken
from User.models import User

def custom_social_auth_response(strategy, details, response, user=None, *args, **kwargs):
    if user:
        refresh = RefreshToken.for_user(user)
        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "age": user.age,
                "address": user.address,
            },
            "jwt": str(refresh.access_token),
            "refresh": str(refresh),
        }
