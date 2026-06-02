from django.conf import settings
from django.db import models


class Customer(models.Model):
    customer_id = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=150)
    cnic = models.CharField(max_length=25, unique=True)
    mobile_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.customer_id} - {self.full_name}"

