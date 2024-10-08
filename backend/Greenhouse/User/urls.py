# urls.py

from django.urls import path
from .views import login_view, logout_view, password_reset_confirm_view, password_reset_view, signup_view, get_user_info_view, set_user_info_view#, social_login_view
from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("signup/", signup_view, name="signup"),
    path("info/", get_user_info_view, name="get_user_info"),
    path("update/", set_user_info_view, name="set_user_info"),
    path('password-reset/', password_reset_view, name='password-reset'),
    path('password-reset-confirm/', password_reset_confirm_view, name='password-reset-confirm'),
    # path('social-login/', social_login_view, name='social-login'),    
]
