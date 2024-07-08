# urls.py

from django.urls import path
from .views import login_view, logout_view, refresh_token_view, signup_view, get_user_info_view, set_user_info_view


urlpatterns = [
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("refresh/", refresh_token_view, name="token_refresh"),
    path("signup/", signup_view, name="signup"),
    path("info/", get_user_info_view, name="get_user_info"),
    path("update/", set_user_info_view, name="set_user_info"),
]
