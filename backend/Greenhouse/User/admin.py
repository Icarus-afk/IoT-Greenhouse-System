from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(DefaultUserAdmin):
    list_display = ('username', 'email', 'age', 'address', 'is_staff', 'date_joined')
    list_filter = ('is_staff', 'is_active', 'groups')
    search_fields = ('username', 'email')
    ordering = ('username',)
    filter_horizontal = ('groups', 'user_permissions',)
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (('Personal info'), {'fields': ('first_name', 'last_name', 'email', 'age', 'address')}),
        (('Permissions'), {'fields': ( 'is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
        (('Important dates'), {'fields': ('last_login',)}),
    )
    
    