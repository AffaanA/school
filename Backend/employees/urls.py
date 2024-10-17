from django.urls import path
from .views import  EmployeeListCreateView, EmployeeUpdateDeleteView,EmployeeAttendanceView, GetEmployeesBySchoolView, AttendanceCheckInCheckOutView

urlpatterns = [
    path('employee/<account_id>', EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('employee-update-del/<int:pk>', EmployeeUpdateDeleteView.as_view(), name='employee-detail'),
    path('employees-list/<account_id>', GetEmployeesBySchoolView.as_view(), name='get-employees-by-school'),
    path('attendance-employee', AttendanceCheckInCheckOutView.as_view(), name='create_attendance'), 
    path('attendancelist-employee/<account_id>', EmployeeAttendanceView.as_view(), name='list_attendance'),     
]

