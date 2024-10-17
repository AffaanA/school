from django.db import models
from account.models import UserAccount
from school.models import Class, SchoolProfile

class Family(models.Model):
    family_name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.family_name
class Parent(models.Model):
    family = models.ForeignKey(Family, related_name='parents', on_delete=models.CASCADE, null=True)
    ROLE_CHOICES = [
        ('Father', 'Father'),
        ('Mother', 'Mother')
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    name = models.CharField(max_length=255)
    education = models.CharField(max_length=255, blank=True, null=True)
    national_id = models.CharField(max_length=50, blank=True, null=True)
    mobile_no = models.CharField(max_length=15, blank=True, null=True)
    occupation = models.CharField(max_length=255, blank=True, null=True)
    profession = models.CharField(max_length=255, blank=True, null=True)
    income = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return f"{self.role}: {self.name}"
    
class Student(models.Model):
    user= models.ForeignKey(UserAccount, on_delete=models.CASCADE, null=True)
    school = models.ForeignKey(SchoolProfile, related_name='school_student', on_delete=models.CASCADE, null=True, blank=True)
    family = models.ForeignKey(Family, related_name='family', on_delete=models.CASCADE, null=True)
    student_name = models.CharField(max_length=255)
    picture = models.ImageField(upload_to='students/', max_length=100, blank=True, null=True)
    registration_no = models.CharField(max_length=50, blank=True, null=True)
    date_of_admission = models.DateField()
    student_class = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, blank=True)
    discount_in_fee = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    mobile_no = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')])
    identification_mark = models.CharField(max_length=255, blank=True, null=True)
    blood_group = models.CharField(max_length=25, blank=True, null=True)
    disease = models.CharField(max_length=255, blank=True, null=True)
    birth_form_id = models.CharField(max_length=50, blank=True, null=True)
    cast = models.CharField(max_length=50, blank=True, null=True)
    previous_school = models.CharField(max_length=255, blank=True, null=True)
    previous_id_board_roll_no = models.CharField(max_length=50, blank=True, null=True)
    additional_note = models.TextField(blank=True, null=True)
    orphan_student = models.BooleanField(default=False)
    osc = models.BooleanField(default=False)
    religion = models.CharField(max_length=50, blank=True, null=True)
    select_family = models.CharField(max_length=50, blank=True, null=True)
    total_siblings = models.IntegerField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    father = models.ForeignKey(Parent, related_name='children_as_father', on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'role': 'Father'})
    mother = models.ForeignKey(Parent, related_name='children_as_mother', on_delete=models.SET_NULL, null=True, blank=True, limit_choices_to={'role': 'Mother'})

    def __str__(self):
        return self.student_name

class Attendance(models.Model):
    STATUS_CHOICES = [
        ('P', 'Present'),
        ('A', 'Absent'),
        ('L', 'Leave'),
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')

    class Meta:
        unique_together = ('student', 'date')  # Ensure one attendance per student per date

    def __str__(self):
        return f"{self.student.student_name} - {self.status} on {self.date}"
