from rest_framework import serializers

from school.models import Class
from .models import Family, Parent, Student, Attendance
from account.models import UserAccount
from rest_framework import serializers
from django.db import transaction
from account.models import UserAccount, UserType
from django.contrib.auth.hashers import make_password
from rest_framework.authtoken.models import Token

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

class ParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parent
        fields = '__all__'

class FamilySerializer(serializers.ModelSerializer):
    class Meta:
        model = Family
        fields = '__all__'
class StudentSerializer(serializers.ModelSerializer):
    father = ParentSerializer(required=False, allow_null=True)
    mother = ParentSerializer(required=False, allow_null=True)
    father_name = serializers.CharField(required=False, allow_null=True)
    father_education = serializers.CharField(required=False, allow_null=True)
    father_national_id = serializers.CharField(required=False, allow_null=True)
    father_mobile_no = serializers.CharField(required=False, allow_null=True)
    father_occupation = serializers.CharField(required=False, allow_null=True)
    father_profession = serializers.CharField(required=False, allow_null=True)
    father_income = serializers.DecimalField(required=False, allow_null=True, max_digits=10, decimal_places=2)
    mother_name = serializers.CharField(required=False, allow_null=True)
    mother_education = serializers.CharField(required=False, allow_null=True)
    mother_national_id = serializers.CharField(required=False, allow_null=True)
    mother_mobile_no = serializers.CharField(required=False, allow_null=True)
    mother_occupation = serializers.CharField(required=False, allow_null=True)
    mother_profession = serializers.CharField(required=False, allow_null=True)
    mother_income = serializers.DecimalField(required=False, allow_null=True, max_digits=10, decimal_places=2)
    password = serializers.CharField(write_only=True)
    type = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    select_family = serializers.PrimaryKeyRelatedField(queryset=Family.objects.all(), required=False)
    class_name = serializers.SerializerMethodField()
    class Meta:
        model = Student
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        self.school_id = kwargs.pop('school_id', None)
        super().__init__(*args, **kwargs)

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        usertype = UserType.objects.get(id=validated_data.pop('type'))
        select_family = validated_data.pop('select_family', None)
        with transaction.atomic():
            # Create user
            user = UserAccount.objects.create(
                email=email,
                username=email,
                type=usertype
            )
            user.password = make_password(password)
            user.save()
            token, created = Token.objects.get_or_create(user=user)
            
            # Handle Family and Parents
            if select_family:
                print("select family", select_family, select_family.id)
                # Fetch the existing Family
                family = Family.objects.get(id=select_family.id)
                father = family.parents.filter(role='Father').first()
                mother = family.parents.filter(role='Mother').first()

                # Remove parent-related fields from validated_data to avoid TypeError
                validated_data.pop('father_name', None)
                validated_data.pop('father_education', None)
                validated_data.pop('father_national_id', None)
                validated_data.pop('father_mobile_no', None)
                validated_data.pop('father_occupation', None)
                validated_data.pop('father_profession', None)
                validated_data.pop('father_income', None)
                validated_data.pop('mother_name', None)
                validated_data.pop('mother_education', None)
                validated_data.pop('mother_national_id', None)
                validated_data.pop('mother_mobile_no', None)
                validated_data.pop('mother_occupation', None)
                validated_data.pop('mother_profession', None)
                validated_data.pop('mother_income', None)
            else:
                # Create Father and Mother if no Family is selected
                father_fields = {
                    'name': validated_data.pop('father_name', None),
                    'education': validated_data.pop('father_education', None),
                    'national_id': validated_data.pop('father_national_id', None),
                    'mobile_no': validated_data.pop('father_mobile_no', None),
                    'occupation': validated_data.pop('father_occupation', None),
                    'profession': validated_data.pop('father_profession', None),
                    'income': validated_data.pop('father_income', None),
                }
                father = Parent.objects.create(role='Father', **father_fields) if father_fields['name'] else None

                mother_fields = {
                    'name': validated_data.pop('mother_name', None),
                    'education': validated_data.pop('mother_education', None),
                    'national_id': validated_data.pop('mother_national_id', None),
                    'mobile_no': validated_data.pop('mother_mobile_no', None),
                    'occupation': validated_data.pop('mother_occupation', None),
                    'profession': validated_data.pop('mother_profession', None),
                    'income': validated_data.pop('mother_income', None),
                }
                mother = Parent.objects.create(role='Mother', **mother_fields) if mother_fields['name'] else None
                
                # Create new Family and associate Parents
                family_name = f"{father.name if father else ''}-{mother.name if mother else ''}"
                family = Family.objects.create(family_name=family_name)

                if father:
                    father.family = family
                    father.save()
                if mother:
                    mother.family = family
                    mother.save()
            
            student = Student.objects.create(
                **validated_data,
                father=father,
                mother=mother,
                user=user,
                email=email,
                school_id=self.school_id,
                family=family,
            )

            return student
 
    def get_class_name(self, obj):
        # Assuming student_class is a ForeignKey to the Class model
        if obj.student_class:
            return obj.student_class.name  # or the appropriate field in the Class model
        return None

class AttendanceSerializer(serializers.ModelSerializer):
    student = StudentSerializer()  # This will include the student's details in the attendance response
    class Meta:
        model = Attendance
        fields = ['student', 'date', 'status']