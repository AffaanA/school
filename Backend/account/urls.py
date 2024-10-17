from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from .views import RegisterView, LoginView,LandingPageView, VerifyEmail, ChangePasswordView
urlpatterns = [
    path('', LandingPageView.as_view(), name='landing'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='user-login'),
    path('email-verify/', VerifyEmail.as_view(), name='email-verify'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
]
