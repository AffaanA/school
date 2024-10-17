# serializers.py
from rest_framework import serializers

from student.models import Student
from .models import FeeChallan, Grade, SchoolProfile, Class, Subject, FeeParticular, Bank
from employees.models import EmployeeProfile


class GradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grade
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class SchoolProfileSerializer(serializers.ModelSerializer):
    grades = GradeSerializer(many=True, read_only=True)  

    class Meta:
        model = SchoolProfile
        fields = '__all__'

class EmployeeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeProfile
        fields = '__all__'

class ClassSerializer(serializers.ModelSerializer):
    teacher = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=EmployeeProfile.objects.filter(user__type__type='Teacher')
    )
    student_count = serializers.SerializerMethodField()
    subjects = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = ['id', 'school', 'name', 'monthly_fee', 'teacher', 'student_count', 'subjects']

    def get_teacher_names(self, obj):
        return [teacher.name for teacher in obj.teacher.all()]
    def get_student_count(self, obj):
        return Student.objects.filter(student_class=obj).count()

    def get_subjects(self, obj):
        return [subject.name for subject in obj.class_school.all()]

class FeeParticularSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeParticular
        fields = '__all__'


class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bank
        fields = ['id', 'school_id', 'name', 'branch_address', 'account_no']


class FeeChallanSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeeChallan
        fields = '__all__'
        read_only_fields = ('school', 'date_generated', 'paid_at', 'tution_fee', 'admission_fee', 
                            'registration_fee', 'art_material', 'transport', 'books', 'uniform', 
                            'fine', 'others', 'late_fine', 'is_paid')

    def create(self, validated_data):
        # Extract account ID from the context
        account_id = self.context['account_id']
        student = validated_data['student']
        month = validated_data['month']

        # Get the corresponding school profile
        school = SchoolProfile.objects.get(user=account_id)
        validated_data['school'] = school

        # Get the class of the student and corresponding fees
        clas = Class.objects.get(id=student.student_class.id)
        tution_fee = clas.monthly_fee
        fee = FeeParticular.objects.get(student=student)

        # Add calculated fees and other validated data to the challan
        validated_data['tution_fee'] = tution_fee
        validated_data['admission_fee'] = fee.admission_fee
        validated_data['registration_fee'] = fee.registration_fee
        validated_data['art_material'] = fee.art_material
        validated_data['transport'] = fee.transport
        validated_data['books'] = fee.books
        validated_data['uniform'] = fee.uniform
        validated_data['fine'] = fee.fine
        validated_data['others'] = fee.others
        validated_data['previous_balance'] = fee.previous_balance
        validated_data['description_of_balance'] = fee.description_of_balance
        validated_data['late_fine'] = self.context['late_fine']

        return super().create(validated_data)



class StudentFeeSerializer(serializers.ModelSerializer):
    fee_challans = FeeChallanSerializer(many=True) 

    class Meta:
        model = Student
        fields = ['id', 'student_name', 'school', 'fee_challans','picture','email', 'mobile_no']  # Add other fields as needed