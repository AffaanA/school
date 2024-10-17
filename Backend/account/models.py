from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.utils.timezone import now
from django.conf import settings
from helpers.mail import send_mail

class UserType(models.Model):
    type = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.type

class UserAccount(AbstractUser):
    email = models.EmailField(unique=True)
    type = models.ForeignKey(UserType, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=False)
    last_login = models.DateTimeField(blank=True, null=True, verbose_name='last login')
    created_at = models.DateTimeField(auto_now_add=True)

    groups = models.ManyToManyField(
        Group,
        related_name='useraccount_groups',  # Custom related_name to avoid clash
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='useraccount_permissions',  # Custom related_name to avoid clash
        blank=True
    )

    def __str__(self):
        return self.email

    class Meta:
        app_label = 'account'

class FCMToken(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    subject, from_email, to = 'Password Reset', settings.EMAIL_HOST_USER, reset_password_token.user.email
    reset_password_link = f"{settings.LINK_OF_REACT_APP}/{reset_password_token.key}/confirm-password"

    data = {
        'user': reset_password_token.user.username,
        'email': reset_password_token.user.email,
        'reset_password_link': reset_password_link,
    }

    send_mail(subject, "forget-password-mail.html", from_email, to, data)



class GlobalParameters(models.Model):
    TYPE_CHOICES = [
        (1, 'Nationality'),
        (2, 'Leave'),
        (3, 'Religion'),
        (4, 'Country'),
        (5, 'State'),
        (6, 'Marital Status'),
        (7, 'Employee Status'),
        (8, 'gender_employee'),
        (9, 'language'),
    ]
    name = models.CharField(max_length=100)
    type = models.IntegerField(choices=TYPE_CHOICES)  
    is_active = models.BooleanField(default=False)  
    created_by = models.ForeignKey(UserAccount, on_delete=models.CASCADE, default=1)  
    created_date = models.DateField(auto_now_add=True)  

    def __str__(self):
        return self.name