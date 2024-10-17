from django.db import models
from django.conf import settings
from account.models import UserAccount
from datetime import datetime

class SchoolProfile(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    logo = models.ImageField(upload_to='logos/', null=True, blank=True)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    website = models.URLField(max_length=200, null=True, blank=True)
    address = models.CharField(max_length=255)
    target_line = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=100)

    def __str__(self):
        return self.name

from employees.models import EmployeeProfile
class Grade(models.Model):
    school = models.ForeignKey(SchoolProfile, related_name='grades', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    from_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    to_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=200)  # Active or Inactive status

    def __str__(self):
        return f"{self.name} ({self.from_percentage}% - {self.to_percentage}%)"


class Class(models.Model):
    school = models.ForeignKey(SchoolProfile, related_name='school', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    monthly_fee = models.DecimalField(max_digits=10, decimal_places=2)
    teacher = models.ManyToManyField(EmployeeProfile)

    def __str__(self):
        return f"{self.name} ({self.school} - {self.teacher})"

class Subject(models.Model):
    class_id = models.ForeignKey(Class, related_name='class_school', on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=100)
    exam_marks = models.DecimalField(max_digits=10, decimal_places=2)
    # teacher = models.ManyToManyField(EmployeeProfile)

    def __str__(self):
        return f"{self.name} ({self.class_id})"
    
from student.models import Student
from datetime import date
from django.utils.timezone import now

class FeeParticular(models.Model):
    FEE_PARTICULARS_CHOICES = [
        ('all_students', 'All Students'),
        ('specific_class', 'Specific Class'),
        ('specific_student', 'Specific Student'),
    ]
    # Choice field for fee particulars
    fee_particulars_for = models.CharField(
        max_length=20,
        choices=FEE_PARTICULARS_CHOICES,
        default='all_students',
    )

    school = models.ForeignKey(SchoolProfile, related_name='fee_particulars', on_delete=models.CASCADE, null=True, blank=True)
    class_id = models.ForeignKey(Class, related_name='fee_particulars', on_delete=models.CASCADE, null=True, blank=True)
    student = models.ForeignKey(Student, related_name='fee_particulars', on_delete=models.CASCADE, null=True, blank=True)
    month = models.DateField(default=date.today)
    admission_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    art_material = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    transport = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    books = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    uniform = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    fine = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    others = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    previous_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    description_of_balance = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.get_fee_particulars_for_display()
    
class Bank(models.Model):
    school_id = models.ForeignKey(SchoolProfile, related_name='school_bank', on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=100)
    branch_address = models.CharField(max_length = 500)
    account_no = models.CharField(max_length=500)
    def __str__(self):
        return f"{self.name} ({self.school_id})"

class FeeChallan(models.Model):
    challan_id = models.CharField(max_length=100, unique=True, editable=False, null=True)
    student = models.ForeignKey(Student, related_name='fee_challans', on_delete=models.CASCADE, null=True, blank=True)
    school = models.ForeignKey(SchoolProfile, related_name='fee_challans', on_delete=models.CASCADE, null=True, blank=True)
    bank = models.ForeignKey(Bank, related_name="fee_bank", on_delete=models.PROTECT)
    month = models.CharField(max_length=20)  # Example: 'August 2024'
    date_generated = models.DateTimeField(default=now)
    due_date = models.DateField()
    is_paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(default=now)
    is_balanced = models.BooleanField(default=False)
    tution_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    admission_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    registration_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    art_material = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    transport = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    books = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    uniform = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    fine = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    others = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    late_fine = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    previous_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    description_of_balance = models.TextField(blank=True, null=True)
    challan_image = models.ImageField(upload_to='challans/', null=True, blank=True)  

    def total_amount(self):
        return (
            self.tution_fee + self.admission_fee + self.registration_fee + self.art_material +
            self.transport + self.books + self.uniform + self.fine + self.others + self.late_fine +self.previous_balance
        )

    def __str__(self):
        return f"Fee Challan for {self.student} - {self.month}"

    def generate_challan_id(self):
        """Generates a unique and sequential challan ID based on school ID, class ID, student ID, and a sequence."""
        school_id = str(self.school.id).zfill(3) if self.school else '000'
        student_id = str(self.student.id).zfill(3) if self.student else '000'
        class_id = str(self.student.student_class.id).zfill(2) if self.student and self.student.student_class else '00'

        # Get the last challan ID and increment the sequence
        last_challan = FeeChallan.objects.filter(school=self.school).order_by('id').last()
        if last_challan:
            last_sequence = int(last_challan.challan_id.split('-')[-1])  # Extract the sequence from the last challan
            new_sequence = str(last_sequence + 1).zfill(4)
        else:
            new_sequence = '0001'  # Start the sequence if no previous challan exists

        # Challan ID format: SCHOOLID-CLASSID-STUDENTID-SEQ
        challan_id = f"{school_id}-{class_id}-{student_id}-{new_sequence}"
        return challan_id

    def save(self, *args, **kwargs):
        if not self.challan_id:
            self.challan_id = self.generate_challan_id()

        super().save(*args, **kwargs)
