from rest_framework import generics, status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from school.models import SchoolProfile
from .models import EmployeeProfile, EmployeeAttendance, CheckInCheckOut
from student.models import Student
from school.models import Class
from .serializers import AttendanceSerializer, EmployeeProfileSerializer
from django.shortcuts import get_object_or_404
from django.views import View
from django.http import JsonResponse
from datetime import datetime
import json
from rest_framework.permissions import AllowAny
from django.http import JsonResponse
class EmployeeListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = EmployeeProfileSerializer

    def get_queryset(self):
        account_id = self.kwargs['account_id']
        school_id = SchoolProfile.objects.get(user=account_id)
        return EmployeeProfile.objects.filter(school_id=school_id)

    def post(self, request, *args, **kwargs):
        account_id = self.kwargs['account_id']
        try:
            school_profile = SchoolProfile.objects.get(user=account_id)
        except SchoolProfile.DoesNotExist:
            return Response({'error': 'SchoolProfile not found for the given account_id.'}, status=status.HTTP_404_NOT_FOUND)

        school_id = school_profile.id
        serializer = EmployeeProfileSerializer(data=request.data, school_id=school_id)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.views.decorators.csrf import csrf_exempt
class EmployeeUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return EmployeeProfile.objects.get(pk=pk)
        except EmployeeProfile.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk, format=None):
        employee = self.get_object(pk)
        if isinstance(employee, Response):  # Check if get_object returned a Response
            return employee
        
        serializer = EmployeeProfileSerializer(employee, data=request.data, partial=True)
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
    
# Get Students by Class
class GetEmployeesBySchoolView(generics.ListAPIView):
    serializer_class = EmployeeProfileSerializer

    def get_queryset(self):
        school = self.kwargs['account_id']
        school_id = SchoolProfile.objects.get(user=school)
        return EmployeeProfile.objects.filter(school=school_id)

class AttendanceCheckInCheckOutView(APIView):
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

        # Check if 'employeesattendence' key is in the parsed data
        if 'employeesattendence' not in attendance_data:
            return Response({"error": "Missing 'employeesattendence' key in the data."}, status=status.HTTP_400_BAD_REQUEST)

        # Process each record in the attendance data
        for record in attendance_data['employeesattendence']:
            employee_id = record.get('employee_id')
            statusa = record.get('attendance')
            date = record.get('date')
            check_in = record.get('check_in')
            check_out = record.get('check_out')

            if employee_id is None or statusa is None:
                return Response(
                    {"error": "Each attendance record must contain 'employee_id' and 'attendance'"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                # Parse the date to ensure it's in the correct format
                attendance_date = datetime.fromisoformat(date.replace('Z', '+00:00')).date()
            except ValueError:
                return Response({"error": "Invalid date format."}, status=status.HTTP_400_BAD_REQUEST)

            # Ensure the employee exists
            try:
                employee = EmployeeProfile.objects.get(id=employee_id)
            except EmployeeProfile.DoesNotExist:
                return Response({"error": f"Employee with ID {employee_id} not found."}, status=status.HTTP_404_NOT_FOUND)

            # Check if attendance already exists for this employee and date
            attendance, created = EmployeeAttendance.objects.get_or_create(
                employee=employee,
                date=attendance_date,
                defaults={'status': statusa}
            )

            if not created:
                attendance.status = statusa
                attendance.save()

            if statusa == "P":
                print("checkstatus",statusa, check_in, check_out)
                # Create CheckInCheckOut record only if check-in/check-out times are provided
                if check_in or check_out:
                    try:
                        check_in_time = datetime.fromisoformat(check_in.replace('Z', '+00:00'))
                    except ValueError:
                        check_in_time = None

                    try:
                        check_out_time = datetime.fromisoformat(check_out.replace('Z', '+00:00'))
                    except ValueError:
                        check_out_time = None
                    print("checkinout time",check_in_time, check_out_time)
                    CheckInCheckOut.objects.create(
                        attendance=attendance,
                        check_in=check_in_time,
                        check_out=check_out_time
                    )

        # Serialize the attendance data to include check-ins
        serializer = AttendanceSerializer(attendance)
        attendance_data = serializer.data

        return Response({
            "message": "Attendance and check-in/check-out recorded successfully.",
            "attendance": attendance_data
        }, status=status.HTTP_200_OK)
    

class EmployeeAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            profile = SchoolProfile.objects.get(user=kwargs.get('account_id'))
            attendances = EmployeeAttendance.objects.filter(employee__school=profile)
            serializer = AttendanceSerializer(attendances, many=True)
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

      