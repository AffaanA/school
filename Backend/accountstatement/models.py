from django.db import models
from school.models import  SchoolProfile
from django.utils import timezone

class AccountStatement(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('IN', 'In'),
        ('OUT', 'Out'),
    ]
    PAYMENT_TYPE_CHOICES = [
        ('Salary', 'Salary'),
        ('Fee', 'Fee'),
    ]


    school = models.ForeignKey(SchoolProfile, on_delete=models.CASCADE, related_name='account_statements')
    transaction_type = models.CharField(
        max_length=3,
        choices=TRANSACTION_TYPE_CHOICES,
        default='IN'
    )
    payment_type = models.CharField(
        max_length=30,
        choices=PAYMENT_TYPE_CHOICES,
        default='Fee'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)
    transaction_date = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount} ({self.school.name})"
