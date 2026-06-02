from django.db import models

from apps.financing_app.models import Installment


class Payment(models.Model):
    METHOD_CHOICES = [
        ("cash", "Cash"),
        ("bank_transfer", "Bank Transfer"),
        ("mobile_wallet", "Mobile Wallet"),
        ("cheque", "Cheque"),
    ]

    installment = models.ForeignKey(Installment, on_delete=models.CASCADE, related_name="payments")
    payment_date = models.DateField(auto_now_add=True)
    payment_method = models.CharField(max_length=30, choices=METHOD_CHOICES)
    transaction_id = models.CharField(max_length=120, blank=True, null=True)
    amount_paid = models.DecimalField(max_digits=16, decimal_places=2)
    profit_portion = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    principal_portion = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    remaining_balance = models.DecimalField(max_digits=16, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

