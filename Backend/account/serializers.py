""" Registers a user after some validations:
	1. Email must be unique
	2. Username must be unique
	3. Two passwords must match 
"""
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

from school.models import SchoolProfile
from .models import UserAccount, UserType

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        max_length=255,
        required=True, 
        validators=[UniqueValidator(queryset=UserAccount.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        max_length=15,
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    type = serializers.PrimaryKeyRelatedField(
        queryset=UserType.objects.all(),
        required=True
    )

    class Meta:
        model = UserAccount
        fields = ['id', 'email', 'password', 'password2', 'type', 'last_login']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password2": "Password fields didn't match."})
        if UserAccount.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email is already in use."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = UserAccount(
            email=validated_data.get('email', ''),
            username=validated_data['email'],  
            type=validated_data['type']
        )
        user.set_password(validated_data['password'])
        user.save()
        if user.type.type == "School":
            profile = SchoolProfile.objects.create(user=user)
            profile.save()
        return user
class ChangePasswordSerializer(serializers.Serializer):
    model = UserAccount

    """
    Serializer for password change endpoint.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
