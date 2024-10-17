from django.urls import path
from .views import  AttendanceView, GetStudentsByClassView, StudentListCreateView, StudentUpdateDeleteView, FamilyList, StudentProfileUpdateView, SubmitAttendanceView

urlpatterns = [
    path('student-profile/<account_id>', StudentProfileUpdateView.as_view(), name='student-profile'),
    path('student/<account_id>', StudentListCreateView.as_view(), name='student-list-create'),
    path('student-update-del/<int:pk>', StudentUpdateDeleteView.as_view(), name='student-detail'),
    path('familylist/<account_id>', FamilyList.as_view(), name='family-list'),        
    path('class/<int:class_id>', GetStudentsByClassView.as_view(), name='get-students-by-class'),
    path('attendance-submit', SubmitAttendanceView.as_view(), name='submit-attendance'),    
    path('attendancelist-student/<account_id>', AttendanceView.as_view(), name='list_attendance-student'),     
]
