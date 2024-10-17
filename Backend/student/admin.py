from django.contrib import admin
from .models import Attendance, Student, Parent

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = (
        'student_name', 
        'registration_no', 
        'date_of_admission', 
        'student_class', 
        'mobile_no'
    )
    search_fields = (
        'student_name', 
        'registration_no', 
    )
    list_filter = (
        'student_class', 
        'gender', 
        'date_of_admission'
    )
    fieldsets = (
        ('Student Information', {
            'fields': (
                'student_name',
                'picture',
                'registration_no',
                'date_of_admission',
                'student_class',
                'discount_in_fee',
                'mobile_no'
            )
        }),
        ('Other Information', {
            'fields': (
                'date_of_birth',
                'gender',
                'identification_mark',
                'blood_group',
                'disease',
                'birth_form_id',
                'cast',
                'previous_school',
                'previous_id_board_roll_no',
                'additional_note',
                'orphan_student',
                'osc',
                'religion',
                'select_family',
                'total_siblings',
                'address'
            )
        }),
    )

admin.site.register(Parent)
admin.site.register(Attendance)