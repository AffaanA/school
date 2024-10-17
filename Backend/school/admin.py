from django.contrib import admin
from .models import Bank, FeeChallan, SchoolProfile, Grade, Class, Subject, FeeParticular

@admin.register(SchoolProfile)
class SchoolAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'phone', 'website', 'city')
    search_fields = ('name', 'user__username', 'phone', 'city')
    list_filter = ('city', 'user')

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'status', 'from_percentage', 'to_percentage')

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'school', 'monthly_fee')
    filter_horizontal = ('teacher',) 

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'class_id', 'exam_marks')
    
@admin.register(FeeParticular)
class FeeParticularAdmin(admin.ModelAdmin):
    list_display = ('fee_particulars_for', 'class_id', 'school','student','month','admission_fee','registration_fee','art_material','transport','books','uniform','fine','others')

@admin.register(FeeChallan)
class FeeChallanAdmin(admin.ModelAdmin):
    list_display = ('student', 'school', 'bank', 'month', 'date_generated', 'due_date', 'is_paid', 'total_amount','challan_id')
    list_filter = ('is_paid', 'month', 'bank','challan_id')
    search_fields = ('student__name', 'school__name', 'month','challan_id')

admin.site.register(Bank)