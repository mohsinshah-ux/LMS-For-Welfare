from rest_framework import serializers

from .models import FinancingApplication, Installment


class FinancingApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancingApplication
        fields = ["id", "application_no", "customer", "financing_type", "financing_amount", "status", "created_at"]


class InstallmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Installment
        fields = [
            "id",
            "application",
            "installment_number",
            "due_date",
            "principal_amount",
            "profit_amount",
            "total_due",
            "paid_amount",
            "outstanding_amount",
            "status",
        ]

