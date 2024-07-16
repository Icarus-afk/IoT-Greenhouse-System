from User.models import BlacklistedToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from django.contrib.auth.hashers import check_password
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomAuthentication(JWTAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '').split()
        if len(auth_header) != 2 or auth_header[0].lower() != 'bearer':
            return None

        raw_token = auth_header[1]
        if BlacklistedToken.objects.filter(token=raw_token).exists():
            raise AuthenticationFailed('Token is blacklisted')

        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token



def authenticate(username=None, password=None):
    """
    Authenticate a user based on username and password.
    """
    print(f"username={username} password={password}")
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            return user
    except User.DoesNotExist:
        return None