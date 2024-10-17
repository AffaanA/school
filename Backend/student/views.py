from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from school.serializers import SchoolProfileSerializer
from .models import Student, Attendance
from .serializers import AttendanceSerializer, FamilySerializer, StudentSerializer
from school.models import SchoolProfile

class StudentListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StudentSerializer

    def get_queryset(self):
        account_id = self.kwargs['account_id']
        school_id = SchoolProfile.objects.get(user=account_id)
        return Student.objects.filter(school_id=school_id)

    def post(self, request, *args, **kwargs):
        account_id = self.kwargs['account_id']
        try:
            school_profile = SchoolProfile.objects.get(user=account_id)
        except SchoolProfile.DoesNotExist:
            return Response({'error': 'SchoolProfile not found for the given account_id.'}, status=status.HTTP_404_NOT_FOUND)

        school_id = school_profile.id
        serializer = self.get_serializer(data=request.data,school_id=school_id)
        if serializer.is_valid(): 
            student = serializer.save()
            return Response(StudentSerializer(student).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from django.views.decorators.csrf import csrf_exempt
class StudentUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Student.objects.get(pk=pk)
        except Student.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        employee = self.get_object(pk)
        if isinstance(employee, Response):  
            return employee
        
        serializer = StudentSerializer(employee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        employee = self.get_object(pk)
        if isinstance(employee, Response):  # Check if get_object returned a Response
            return employee
        
        user_instance = employee.user
        employee.delete()
        user_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class FamilyList(APIView):

    def get(self, request, *args, **kwargs):
        profile = SchoolProfile.objects.get(user=kwargs.get('account_id'))
        students = Student.objects.filter(school=profile)
        
        families = {student.family.id: student.family.family_name for student in students if student.family}
        
        # Prepare a list of dictionaries with id and family_name
        family_list = [{'id': family_id, 'family_name': family_name} for family_id, family_name in families.items()]
        
        return Response(family_list, status=status.HTTP_200_OK)
    

class StudentProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        try:
            profile = Student.objects.get(user=kwargs.get('account_id'))
        except Student.DoesNotExist:
            return Response({"detail": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = StudentSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, *args, **kwargs):
        try:
            # Get the company related to the current user
            profile = Student.objects.get(user=kwargs.get('account_id'))
        except Student.DoesNotExist:
            return Response({"detail": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = StudentSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Get Students by Class
class GetStudentsByClassView(generics.ListAPIView):
    serializer_class = StudentSerializer

    def get_queryset(self):
        class_id = self.kwargs['class_id']
        return Student.objects.filter(student_class_id=class_id)

from django.http import JsonResponse
from rest_framework import status, generics
from rest_framework.response import Response
import json

class SubmitAttendanceView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        # Extract JSON data from form data
        attendance_data = request.data.get('attendanceData', '')

        # Debugging output
        print("Received attendance data:", attendance_data)

        try:
            # Parse the JSON data
            attendance_data = json.loads(attendance_data)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if 'attendance' key is in the parsed data
        if 'attendence' not in attendance_data:
            return Response({"error": "Missing 'attendence' key in the data."}, status=status.HTTP_400_BAD_REQUEST)

        # Process each record in the attendance data
        for record in attendance_data['attendence']:
            student_id = record.get('student_id')
            statusa = record.get('attendance')
            date = record.get('date')
            if student_id is None or statusa is None:
                return Response(
                    {"error": "Each attendance record must contain 'student_id' and 'attendance'"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            date = date.split('T')[0]
            # Debugging output
            print(f"Processing record: student_id={student_id}, status={status}, date={date}")

            # Update or create attendance for the student
            Attendance.objects.update_or_create(
                student_id=student_id,
                date = date,
                defaults={'status': statusa}
            )

        return Response({"message": "Attendance submitted successfully!"}, status=status.HTTP_200_OK)



class AttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            # Get the SchoolProfile based on the account_id passed in the URL
            profile = SchoolProfile.objects.get(user=kwargs.get('account_id'))

            # Filter attendance records by the school profile
            attendances = Attendance.objects.filter(student__school=profile)

            # Serialize the attendance records
            serializer = AttendanceSerializer(attendances, many=True)

            # Return the serialized data in the response
            return Response({
                "status": "success",
                "attendances": serializer.data
            }, status=status.HTTP_200_OK)

        except SchoolProfile.DoesNotExist:
            return Response({
                "status": "error",
                "message": "School profile not found."
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

      