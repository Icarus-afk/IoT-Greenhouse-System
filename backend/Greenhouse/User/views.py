import logging
from User.models import BlacklistedToken
from rest_framework import generics, permissions
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import PermissionDenied
from User.authenticate import CustomAuthentication, authenticate
from Config.response import create_response



User = get_user_model()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)



@api_view(["POST"])
def signup_view(request):
    """
    Register a new user.
    """
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")
    first_name = request.data.get("first_name", "")
    last_name = request.data.get("last_name", "")
    age = request.data.get("age")
    address = request.data.get("address", "")

    if not username or not password or not email:
        return create_response(message="Username, password, and email are required", status_code=status.HTTP_400_BAD_REQUEST, success=False)
    
    if User.objects.filter(username=username).exists():
        return create_response(message="Username already exists", status_code=status.HTTP_400_BAD_REQUEST, success=False)

    if User.objects.filter(email=email).exists():
        return create_response(message="Email already registered", status_code=status.HTTP_400_BAD_REQUEST, success=False)

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
        first_name=first_name,
        last_name=last_name,
        age=age,
        address=address,
        is_active=True
    )

    return create_response(message="User created successfully", status_code=status.HTTP_201_CREATED)



@api_view(["GET"])
@authentication_classes([CustomAuthentication])
def get_user_info_view(request):
    """
    Get information about the authenticated user.
    """
    if request.user.is_authenticated:
        user_info = {
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
            "age": request.user.age,
            "address": request.user.address,
            "joined": request.user.joined.strftime('%Y-%m-%d %H:%M:%S')
        }
        return create_response(data=user_info, message="User info retrieved successfully")
    else:
        return create_response(message="Authentication required", status_code=status.HTTP_401_UNAUTHORIZED, success=False)




@api_view(["POST"])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    logger.info(f"Login attempt for user: {username}")
    user = User.objects.filter(username=username).first()

    try:
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            response_data = {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "age": user.age,
                    "address": user.address,
                    "joined": user.joined
                },
                "jwt": str(refresh.access_token),
                "refresh": str(refresh),
            }
            logger.info(f"User {username} logged in successfully")
            return create_response(data=response_data, message="Login successful")
        else:
            logger.warning(f"Invalid login attempt for user: {username}")
            return create_response(message="Invalid credentials", status_code=status.HTTP_401_UNAUTHORIZED, success=False)
    except PermissionDenied:
        logger.error(f"Permission denied for user: {username}")
        return create_response(message="Permission denied", status_code=status.HTTP_403_FORBIDDEN, success=False)
    except Exception as e:
        logger.error(f"An error occurred during authentication for user {username}: {e}")
        return create_response(message="An error occurred during authentication", status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, success=False)



@api_view(["GET"])
@authentication_classes([CustomAuthentication])
def refresh_token_view(request):
    """
    Refresh JWT token using refresh token from Authorization header.
    """
    auth_header = request.META.get('HTTP_AUTHORIZATION', '').split()
    if len(auth_header) != 2 or auth_header[0].lower() != 'bearer':
        return create_response(message="Refresh token not found", status_code=status.HTTP_400_BAD_REQUEST, success=False)

    refresh_token = auth_header[1]
    
    try:
        token = RefreshToken(refresh_token)
        response_data = {
            "message": "Token refreshed",
            "jwt": str(token.access_token),
            "refresh": str(token)
        }
        return create_response(data=response_data, message="Token refreshed")
    except Exception as e:
        return create_response(message=str(e), status_code=status.HTTP_400_BAD_REQUEST, success=False)



@api_view(["PUT"])
@authentication_classes([CustomAuthentication])
def set_user_info_view(request):
    """
    Update information of the authenticated user.
    """
    logger.info(f"request: {request}")
    logger.info(f"Request user: {request.user}")
    logger.info(f"Is authenticated: {request.user.is_authenticated}")

    if request.user.is_authenticated:
        user = request.user

        # Log current user details
        logger.info(f"Current User - First Name: {user.first_name}, Last Name: {user.last_name}, Email: {user.email}")

        # Update user details
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.email = request.data.get("email", user.email)
        user.age = request.data.get("age", user.age)
        user.address = request.data.get("address", user.address)

        # Save user information and log update
        user.save()
        logger.info("User information updated successfully")

        return create_response(message="User information updated successfully", status_code=status.HTTP_200_OK)
    else:
        logger.info("User is not authenticated")
        return create_response(message="Authentication required", status_code=status.HTTP_401_UNAUTHORIZED, success=False)



@api_view(["GET"])
@authentication_classes([CustomAuthentication])
def logout_view(request):
    token = request.auth
    BlacklistedToken.objects.create(token=str(token))
    return create_response(message="Logout successful", status_code=status.HTTP_200_OK, success=True)