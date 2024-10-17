from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
import json
from django.db.models import Sum
from accountstatement.models import AccountStatement
from employees.models import EmployeeProfile
from student.models import Student
from student.serializers import StudentSerializer
from .models import Bank, FeeChallan, FeeParticular, SchoolProfile, Grade, Class, Subject
from .serializers import BankSerializer, EmployeeProfileSerializer, FeeChallanSerializer, FeeParticularSerializer, SchoolProfileSerializer, GradeSerializer, ClassSerializer, StudentFeeSerializer, SubjectSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, permissions
from datetime import date, datetime
from django.utils import timezone
from django.utils.timezone import now
from rest_framework import serializers 
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import transaction
from employees.models import EmployeeProfile
class SchoolProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        try:
            profile = SchoolProfile.objects.get(user=kwargs.get('account_id'))
        except SchoolProfile.DoesNotExist:
            return Response({"detail": "SchoolProfile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SchoolProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, *args, **kwargs):
        try:
            # Get the profile related to the current user
            profile = SchoolProfile.objects.get(user=kwargs.get('account_id'))
        except SchoolProfile.DoesNotExist:
            return Response({"detail": "SchoolProfile not found."}, status=status.HTTP_404_NOT_FOUND)

        # Calculate the counts for employees, students, and classes
        total_employees = EmployeeProfile.objects.filter(school=profile).count()
        total_students = Student.objects.filter(school=profile).count()
        total_classes = Class.objects.filter(school=profile).count()

        # Serialize the profile data
        serializer = SchoolProfileSerializer(profile)
        profile_data = serializer.data

        # Add the additional counts to the serialized data
        profile_data.update({
            'total_employees': total_employees,
            'total_students': total_students,
            'total_classes': total_classes,
        })

        # Return the updated profile data including the additional information
        return Response(profile_data, status=status.HTTP_200_OK)


    
class GradeListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        profile= SchoolProfile.objects.get(user=kwargs.get('account_id'))
        grades = Grade.objects.filter(school=profile)
        serializer = GradeSerializer(grades, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class GradeAddView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data
        if not isinstance(data, list):
            return Response({"detail": "Expected a list of new grades."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = GradeSerializer(data=data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)   
class GradeUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        account_id = kwargs.get('account_id')
        school_id = SchoolProfile.objects.get(user=account_id)
        grades_data = request.data.get('grades', '[]')
        try:
            grades_data = json.loads(grades_data)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data."}, status=status.HTTP_400_BAD_REQUEST)
        results = []
        errors = []

        # Process each grade
        for grade_data in grades_data:
            grade_id = grade_data.get('id', None)
            if 'school' not in grade_data:
                    grade_data['school'] = school_id.id
            if grade_id:
                try:
                    grade = Grade.objects.get(pk=grade_id)
                    serializer = GradeSerializer(grade, data=grade_data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        results.append(serializer.data)
                    else:
                        errors.append({"id": grade_id, "errors": serializer.errors})
                except Grade.DoesNotExist:
                    errors.append({"id": grade_id, "error": "Grade not found"})
            else:
                print("gradedataaa", grade_data)
                serializer = GradeSerializer(data=grade_data)
                if serializer.is_valid():
                    serializer.save()
                    results.append(serializer.data)
                else:
                    errors.append({"data": grade_data, "errors": serializer.errors})
        if errors:
            return Response({"results": results, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"results": results}, status=status.HTTP_200_OK)
class ClassListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ClassSerializer

    def get_queryset(self):
        profile = SchoolProfile.objects.get(user=self.kwargs.get('account_id'))
        return Class.objects.filter(school=profile)

    def get(self, request, *args, **kwargs):
        classes = self.get_queryset()
        serializer = self.get_serializer(classes, many=True)
        data = serializer.data
        for i, class_data in enumerate(data):
            class_data['teacher_names'] = [teacher.name for teacher in classes[i].teacher.all()]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        account_id = self.kwargs.get('account_id')
        school = SchoolProfile.objects.get(user=account_id)

        data = request.data.copy()
        data['school'] = school.id  

        serializer = self.get_serializer(data=data)

        if serializer.is_valid():
            serializer.save(school=school)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # Return the errors if the serializer is invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ClassDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Get the class instance and include teacher names
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        data['teacher_names'] = [teacher.name for teacher in instance.teacher.all()]
        return Response(data, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy() 
        
        if 'school' not in data:
            data['school'] = instance.school.id  

        serializer = self.get_serializer(instance, data=data, partial=True)
        if serializer.is_valid(raise_exception=True):
            self.perform_update(serializer)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)
class TeacherList(APIView):

    def get(self, request, *args, **kwargs):
        profile= SchoolProfile.objects.get(user=kwargs.get('account_id'))
        teachers = EmployeeProfile.objects.filter(school=profile, user__type__type="Teacher")
        serializer = EmployeeProfileSerializer(teachers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class SubjectListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        profile= SchoolProfile.objects.get(user=kwargs.get('account_id'))
        classes=Class.objects.filter(school=profile)
        subjects = Subject.objects.filter(class_id__in=classes)
        serializer_class = SubjectSerializer(subjects, many=True)
        for i in range(0, len(subjects)):
            serializer_class.data[i]['class_name'] = subjects[i].class_id.name
        return Response(serializer_class.data, status=status.HTTP_200_OK)

class SubjectListClassView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        classes=Class.objects.filter(id=kwargs.get('account_id'))
        subjects = Subject.objects.filter(class_id__in=classes)
        serializer_class = SubjectSerializer(subjects, many=True)
        for i in range(0, len(subjects)):
            serializer_class.data[i]['class_name'] = subjects[i].class_id.name
        return Response(serializer_class.data, status=status.HTTP_200_OK)
class SubjectUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        account_id = kwargs.get('account_id')
        school_id = SchoolProfile.objects.get(user=account_id)
        
        subjects_data = request.data.get('subjects', '[]')

        # Log the type and content of subjects_data for debugging
        print(f"subjects_data type: {type(subjects_data)}")
        print(f"subjects_data content: {subjects_data}")

        # Ensure subjects_data is parsed correctly
        if isinstance(subjects_data, str):
            try:
                subjects_data = json.loads(subjects_data)
            except json.JSONDecodeError:
                return Response({"error": "Invalid JSON data."}, status=status.HTTP_400_BAD_REQUEST)
        elif not isinstance(subjects_data, (list, dict)):
            return Response({"error": "Subjects data must be a list or a single object."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Ensure subjects_data is in list format
        if isinstance(subjects_data, dict):
            subjects_data = [subjects_data]
        
        results = []
        errors = []
        
        for grade_data in subjects_data:
            grade_id = grade_data.get('id', None)
            if 'school' not in grade_data:
                grade_data['school'] = school_id.id
            
            if grade_id:
                try:
                    grade = Subject.objects.get(pk=grade_id)
                    serializer = SubjectSerializer(grade, data=grade_data, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        results.append(serializer.data)
                    else:
                        errors.append({"id": grade_id, "errors": serializer.errors})
                except Subject.DoesNotExist:
                    errors.append({"id": grade_id, "error": "Subject not found"})
            else:
                serializer = SubjectSerializer(data=grade_data)
                if serializer.is_valid():
                    serializer.save()
                    results.append(serializer.data)
                else:
                    errors.append({"data": grade_data, "errors": serializer.errors})
        
        if errors:
            return Response({"results": results, "errors": errors}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"results": results}, status=status.HTTP_200_OK)


    def delete(self, request, *args, **kwargs):
            subject_id = kwargs.get('account_id')
            if not subject_id:
                return Response({"error": "Subject ID is required."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                subject = Subject.objects.get(pk=subject_id)
                subject.delete()
                return Response({"message": "Subject deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
            except Subject.DoesNotExist:
                return Response({"error": "Subject not found."}, status=status.HTTP_404_NOT_FOUND)
class ClassList(APIView):

    def get(self, request, *args, **kwargs):
        profile= SchoolProfile.objects.get(user=kwargs.get('account_id'))
        classes = Class.objects.filter(school=profile)
        serializer = ClassSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)    
class StudentList(APIView):

    def get(self, request, *args, **kwargs):
        profile= SchoolProfile.objects.get(user=kwargs.get('account_id'))
        classes = Student.objects.filter(school=profile)
        serializer = StudentSerializer(classes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class BankList(APIView):

    def get(self, request, *args, **kwargs):
        profile= SchoolProfile.objects.get(user=kwargs.get('account_id'))
        banks = Bank.objects.filter(school_id=profile)
        serializer = BankSerializer(banks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 
class FeeParticularCreateView(APIView):
    def post(self, request, *args, **kwargs):
        account_id = kwargs.get('account_id')
        try:
            school = SchoolProfile.objects.get(user=account_id)
        except SchoolProfile.DoesNotExist:
            return Response({"error": "School not found"}, status=status.HTTP_404_NOT_FOUND)

        fee_particulars_for = request.data.get('fee_particulars_for')
        month = request.data.get('month', date.today().month)
        admission_fee = request.data.get('admission_fee', 0)
        registration_fee = request.data.get('registration_fee', 0)
        art_material = request.data.get('art_material', 0)
        transport = request.data.get('transport', 0)
        books = request.data.get('books', 0)
        uniform = request.data.get('uniform', 0)
        fine = request.data.get('fine', 0)
        others = request.data.get('others', 0)

        if fee_particulars_for == 'all_students':
            students = Student.objects.filter(school=school)
            for student in students:
                FeeParticular.objects.update_or_create(
                    student=student,
                    school=school,
                    defaults={
                        'fee_particulars_for': 'all_students',
                        'admission_fee': admission_fee,
                        'registration_fee': registration_fee,
                        'art_material': art_material,
                        'transport': transport,
                        'books': books,
                        'uniform': uniform,
                        'fine': fine,
                        'others': others,
                        'class_id': student.student_class,
                    }
                )

        elif fee_particulars_for == 'specific_class':
            class_id = request.data.get('class_id')
            try:
                class_obj = Class.objects.get(id=class_id, school=school)
            except Class.DoesNotExist:
                return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)

            students = Student.objects.filter(student_class=class_obj)
            for student in students:
                FeeParticular.objects.update_or_create(
                    student=student,
                    school=school,
                    defaults={
                        'fee_particulars_for': 'specific_class',
                        'admission_fee': admission_fee,
                        'registration_fee': registration_fee,
                        'art_material': art_material,
                        'transport': transport,
                        'books': books,
                        'uniform': uniform,
                        'fine': fine,
                        'others': others,
                        'class_id': class_obj,
                    }
                )

        elif fee_particulars_for == 'specific_student':
            student_id = request.data.get('student')
            try:
                student = Student.objects.get(id=student_id, school=school)
            except Student.DoesNotExist:
                return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

            FeeParticular.objects.update_or_create(
                student=student,
                school=school,
                defaults={
                    'fee_particulars_for': 'specific_student',
                    'admission_fee': admission_fee,
                    'registration_fee': registration_fee,
                    'art_material': art_material,
                    'transport': transport,
                    'books': books,
                    'uniform': uniform,
                    'fine': fine,
                    'others': others,
                    'class_id': student.student_class,
                }
            )

        return Response({"message": "Fee particulars processed successfully"}, status=status.HTTP_200_OK)   
class FeeParticularRetrieveView(APIView):

    def get(self, request, *args, **kwargs):
        account_id = kwargs.get('account_id')
        
        # Get the fee_particulars_for type
        fee_particulars_for = request.query_params.get('fee_particulars_for')
        print("fee_particulars_for :",fee_particulars_for)
        response_data = {}

        try:
            # Retrieve the school by account_id
            school = SchoolProfile.objects.get(user=account_id)
        except SchoolProfile.DoesNotExist:
            return Response({"error": "School not found"}, status=status.HTTP_404_NOT_FOUND)

        if fee_particulars_for == 'all_students':
            # Get any one of the fee particulars for all students to display on the front-end
            fee_particular = FeeParticular.objects.filter(
                school=school,
                fee_particulars_for='all_students'
            ).first()

            if fee_particular:
                serializer = FeeParticularSerializer(fee_particular)
                response_data = serializer.data
            else:
                return Response({"error": "No fee particulars found for all students"}, status=status.HTTP_404_NOT_FOUND)

        elif fee_particulars_for == 'specific_class':
            class_id = request.query_params.get('class_id')
            print("class_id :",class_id)
            try:
                class_obj = Class.objects.get(id=class_id)
            except Class.DoesNotExist:
                return Response({"error": "Class not found"}, status=status.HTTP_404_NOT_FOUND)

            # Get any one of the fee particulars for the specific class
            fee_particular = FeeParticular.objects.filter(
                class_id=class_obj,
                fee_particulars_for='specific_class'
            ).first()

            if fee_particular:
                serializer = FeeParticularSerializer(fee_particular)
                response_data = serializer.data
            else:
                return Response({"error": "No fee particulars found for the selected class"}, status=status.HTTP_404_NOT_FOUND)

        elif fee_particulars_for == 'specific_student':
            student_id = request.query_params.get('student_id')
            print("student_id :",student_id)
            try:
                student = Student.objects.get(id=student_id)
            except Student.DoesNotExist:
                return Response({"error": "Student not found"}, status=status.HTTP_404_NOT_FOUND)

            # Get the fee particulars for the specific student
            fee_particular = FeeParticular.objects.filter(
                student=student,
            ).first()

            if fee_particular:
                serializer = FeeParticularSerializer(fee_particular)
                response_data = serializer.data
            else:
                return Response({"error": "No fee particulars found for the selected student"}, status=status.HTTP_404_NOT_FOUND)

        else:
            return Response({"error": "Invalid fee_particulars_for value"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(response_data, status=status.HTTP_200_OK)   




class BankListCreateView(generics.ListCreateAPIView):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer

    def get_queryset(self):
        # Filter banks by school_id using account_id passed from the frontend
        account_id = self.kwargs.get('account_id')
        if account_id:
            try:
                school = SchoolProfile.objects.get(user=account_id)
                return Bank.objects.filter(school_id=school.id)
            except SchoolProfile.DoesNotExist:
                return Bank.objects.none()
        return super().get_queryset()

    def perform_create(self, serializer):
        # Convert account_id to school_id
        account_id = self.kwargs.get('account_id')
        if account_id:
            try:
                school = SchoolProfile.objects.get(user=account_id)
                serializer.save(school_id=school)
            except SchoolProfile.DoesNotExist:
                raise serializers.ValidationError("Invalid account_id")
        else:
            raise serializers.ValidationError("account_id is required")
class BankRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Bank.objects.all()
    serializer_class = BankSerializer
    lookup_field = 'id'
from rest_framework.response import Response
from rest_framework import status

class FeeChallanCreateView(APIView):
    def post(self, request, *args, **kwargs):
        account_id = kwargs.get('account_id')  # Get the account_id from URL kwargs
        serializer = FeeChallanSerializer(data=request.data, context={'account_id': account_id, 'late_fine': request.data.get('late_fine')})

        if serializer.is_valid():
            student = serializer.validated_data['student']
            month = serializer.validated_data['month']

            # Check if a challan already exists for the student and month
            if FeeChallan.objects.filter(student=student, month=month).exists():
                return Response({"message": "Challan for this student and month already exists."},  status=status.HTTP_200_OK)

            # Save the new challan
            challan = serializer.save()
            challan_data = FeeChallanSerializer(challan).data
            return Response({"message": "Challan created successfully.","data": challan_data}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FeeChallanUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        student_id = request.data.get('student')
        month = request.data.get('month')
        challan_number = request.data.get('challan_number')
        challan_image = request.FILES.get('image')

        if not student_id or not challan_number:
            return Response({'message': 'Student ID and Challan Number are required'}, status=status.HTTP_200_OK)

        try:
            # Find the student by ID
            student = Student.objects.get(id=student_id)

            # Try to get the fee challan record
            try:
                fee_challan = FeeChallan.objects.get(
                    student=student, challan_id=challan_number
                )
                # Check if the fee is already paid
                if fee_challan.is_paid:
                    return Response({'message': 'Fee record is already paid'}, status=status.HTTP_400_BAD_REQUEST)

                fee_challan.challan_image = challan_image
                fee_challan.is_paid = True
                fee_challan.paid_at = timezone.now()
                fee_challan.save()
                feepart = FeeParticular.objects.get(student=student)
                feepart.previous_balance = 0
                feepart.description_of_balance = "" 
                feepart.save()
                account_statement= AccountStatement.objects.create(
                school=student.school,  
                transaction_type="IN",
                amount=fee_challan.total_amount(), 
                description=f"Fee payment for {student.student_name} - {month}",
                transaction_date=timezone.now(),
            )
                account_statement.save()

                serializer = FeeChallanSerializer(fee_challan)
                return Response(serializer.data, status=status.HTTP_200_OK)

            except FeeChallan.DoesNotExist:
                return Response({'message': 'Fee challan record not found'}, status=status.HTTP_404_NOT_FOUND)

        except Student.DoesNotExist:
            return Response({'message': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class DefaultersList(APIView):
    def get(self, request, *args, **kwargs):
        account_id = kwargs.get('account_id')
        
        try:
            school = SchoolProfile.objects.get(user=account_id)
        except SchoolProfile.DoesNotExist:
            return Response({'message': 'School not found'}, status=status.HTTP_404_NOT_FOUND)

        unpaid_fee_students = Student.objects.filter(
            school=school,  
            fee_challans__is_paid=False, fee_challans__is_balanced=False  # Filter unpaid FeeChallan records
        ).distinct()

        serializer = StudentFeeSerializer(unpaid_fee_students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
      
    def put(self, request, *args, **kwargs):
        account_id = kwargs.get('account_id')
        
        try:
            school = SchoolProfile.objects.get(user=account_id)
        except SchoolProfile.DoesNotExist:
            return Response({'message': 'School not found'}, status=status.HTTP_404_NOT_FOUND)

        # Get all unpaid fee challans for students in the school
        unpaid_fee_students = Student.objects.filter(
            school=school,  
            fee_challans__is_paid=False
        ).distinct()

        for student in unpaid_fee_students:
            unpaid_challans = student.fee_challans.filter(is_paid=False)
            # Create a list of months from unpaid challans
            months = unpaid_challans.values_list('month', flat=True).distinct()
            month_names = ", ".join(months)  # Join months into a comma-separated string
            total_unpaid = sum([challan.total_amount() for challan in unpaid_challans])

            # Create an entry in FeeParticular table for this student
            fee = FeeParticular.objects.get(
                student=student,
            )
            fee.description_of_balance=f"Remaining fee for the months of {month_names}",
            fee.previous_balance=total_unpaid
            fee.save()
            # Update challans to mark them as balanced
            unpaid_challans.update(is_balanced=True)

        # Serialize and return the updated student fee data
        serializer = StudentFeeSerializer(unpaid_fee_students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)