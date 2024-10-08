"""
URL configuration for Greenhouse project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.contrib import admin
from django.conf.urls.static import static
from django.conf.urls import include
from django.conf import settings
from django.contrib import admin

admin.site.site_header = 'Greenhouse System Control Panel'
admin.site.site_title = 'Greenhouse System Control Panel'
admin.site.index_title = 'Greenhouse System Control Panel'

urlpatterns = [
    path("admin/", admin.site.urls),
    path("user/", include("User.urls")),
    path("device/", include("Device.urls")),
    path("notification/", include("Notification.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
