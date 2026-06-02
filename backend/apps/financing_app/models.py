from django.conf import settings
from django.db import models

from apps.customer_app.models import Customer


class FinancingApplication(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("submitted", "Submitted"),
        ("verification", "Verification"),
        ("manager_review", "Manager Review"),
        ("approved", "Approved"),
        ("agreement_generation", "Agreement Generation"),
        ("disbursed", "Disbursed"),
        ("active", "Active"),
        ("closed", "Closed"),
        ("rejected", "Rejected"),
    ]

    application_no = models.CharField(max_length=60, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    financing_type = models.CharField(max_length=80)
    financing_amount = models.DecimalField(max_digits=16, decimal_places=2)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default="draft")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Installment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("partial", "Partial"),
        ("overdue", "Overdue"),
        ("written_off", "Written Off"),
    ]

    application = models.ForeignKey(FinancingApplication, on_delete=models.CASCADE, related_name="installments")
    installment_number = models.PositiveIntegerField()
    due_date = models.DateField()
    principal_amount = models.DecimalField(max_digits=16, decimal_places=2)
    profit_amount = models.DecimalField(max_digits=16, decimal_places=2)
    total_due = models.DecimalField(max_digits=16, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    outstanding_amount = models.DecimalField(max_digits=16, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    class Meta:
        unique_together = ("application", "installment_number")

