from django.contrib import admin
from .models import EmployeeProfile, EmployeeAttendance, CheckInCheckOut





admin.site.register(EmployeeProfile)
admin.site.register(EmployeeAttendance)
admin.site.register(CheckInCheckOut)