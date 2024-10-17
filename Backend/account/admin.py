from django.contrib import admin
from .models import UserAccount, UserType, FCMToken, GlobalParameters
from django.contrib import auth
from rest_framework.authtoken.models import TokenProxy
from django_rest_passwordreset.models import ResetPasswordToken

@admin.register(UserAccount)
class UserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username','email', 'type','is_active','created_at', 'last_login']



admin.site.register(UserType)
admin.site.register(FCMToken)
admin.site.register(GlobalParameters)
# Unregister not required models here
admin.site.unregister(auth.models.Group)
# admin.site.unregister(TokenProxy)
admin.site.unregister(ResetPasswordToken)