from django.db import models
from account.models import UserAccount, GlobalParameters
from school.models import SchoolProfile  

class EmployeeProfile(models.Model):
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Probation', 'Probation'),
        ('Resigned', 'Resigned'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    school = models.ForeignKey(SchoolProfile, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=100, unique=True, editable=False, null=True)
    picture = models.ImageField(upload_to='profile/', null=True, blank=True)
    date_joined = models.DateField()
    monthly_salary = models.DecimalField(max_digits=10, decimal_places=2)
    father_husband_name = models.CharField(max_length=255)
    gender = models.ForeignKey(GlobalParameters, on_delete=models.SET_NULL, null=True, limit_choices_to={'type': 8}, related_name='employee_gender')
    experience = models.CharField(max_length=255)
    national_id = models.CharField(max_length=50)
    religion = models.ForeignKey(GlobalParameters, on_delete=models.SET_NULL, null=True, limit_choices_to={'type': 3}, related_name='employees_religion')
    email = models.EmailField(max_length=255, null=True, blank=True)
    education = models.CharField(max_length=255)
    blood_group = models.CharField(max_length=50)
    dob = models.DateField()
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255)
    work_number = models.CharField(max_length=15, blank=True, null=True)
    mobile_number = models.CharField(max_length=15, blank=True, null=True)
    family_contact = models.CharField(max_length=15, blank=True, null=True)
    personal_email = models.EmailField(blank=True, null=True)
    cv = models.FileField(upload_to='cvs/', blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class EmployeeAttendance(models.Model):
    STATUS_CHOICES = [
        ('P', 'Present'),
        ('A', 'Absent'),
        ('L', 'Leave'),
    ]

    employee = models.ForeignKey(EmployeeProfile, on_delete=models.CASCADE)
    date = models.DateField()  # Date of attendance
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')

    class Meta:
        unique_together = ('employee', 'date')

    def __str__(self):
        return f"{self.employee.name} - {self.status} on {self.date}"

class CheckInCheckOut(models.Model):
    attendance = models.ForeignKey(EmployeeAttendance, on_delete=models.CASCADE, related_name='checkin_checkout_times')
    check_in = models.DateTimeField()
    check_out = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Check-In: {self.check_in}, Check-Out: {self.check_out or 'Pending'}"