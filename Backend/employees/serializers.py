import uuid
from rest_framework import serializers
from django.db import transaction
from account.models import UserAccount, UserType
from django.contrib.auth.hashers import make_password
from employees.models import EmployeeProfile, EmployeeAttendance, CheckInCheckOut
from rest_framework.authtoken.models import Token
from school.models import Class, Subject
class UserAccountSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserAccount
        fields = ['email', 'password', 'type']

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data['email']
        user = UserAccount(
            email=email,
            username=email,
            type=validated_data['type']
        )
        user.password = make_password(password)
        user.save()
        return user

class EmployeeProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    type = serializers.CharField(write_only=True)
    user_type = serializers.SerializerMethodField()  # serialized user type
    email = serializers.EmailField()
    classes = serializers.SerializerMethodField()

    class Meta:
        model = EmployeeProfile
        fields = [
            'id', 'name', 'email', 'phone', 'password', 'education', 'monthly_salary','employee_id',
            'address', 'date_joined', 'dob', 'experience', 'national_id',
            'father_husband_name', 'blood_group', 'type', 'user_type', 'classes'
        ]

    def __init__(self, *args, **kwargs):
        self.school_id = kwargs.pop('school_id', None)
        super().__init__(*args, **kwargs)

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        usertype = UserType.objects.get(id=validated_data.pop('type'))

        with transaction.atomic():
            # Create user account
            user = UserAccount.objects.create(
                email=email,
                username=email,
                type=usertype
            )
            user.password = make_password(password)
            user.save()

            # Create the employee profile
            employee_profile = EmployeeProfile.objects.create(
                user=user,
                email=email,
                school_id=self.school_id,
                **validated_data
            )

            # Generate unique employee_id after the profile is saved
            employee_profile.employee_id = f'{self.school_id}-{employee_profile.id}-{employee_profile.date_joined.year}-{uuid.uuid4().hex[:6]}'
            employee_profile.save()

        return employee_profile

    def get_classes(self, obj):
        classes = Class.objects.filter(teacher=obj)
        return [
            {
                'name': cls.name,
                'subjects': [
                    {'name': subj.name}
                    for subj in Subject.objects.filter(class_id=cls)
                ]
            }
            for cls in classes
        ]

    def get_user_type(self, obj):
        print("objjj", obj)
        return obj.user.type.type if obj.user and obj.user.type else obj.user.type
      
        
class CheckInCheckOutSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckInCheckOut
        fields = ['check_in_time', 'check_out_time']


class AttendanceSerializer(serializers.ModelSerializer):
    checkins = CheckInCheckOutSerializer(many=True, read_only=True)
    employee = EmployeeProfileSerializer()
    class Meta:
        model = EmployeeAttendance
        fields = ['id', 'employee', 'status', 'date','checkins']
