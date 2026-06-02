from decimal import Decimal

from rest_framework import generics, permissions

from apps.financing_app.models import Installment

from .models import Payment
from .serializers import PaymentSerializer


class PaymentListView(generics.ListAPIView):
    queryset = Payment.objects.all().order_by("-created_at")
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]


class PaymentCreateView(generics.CreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        installment = Installment.objects.get(pk=self.request.data.get("installment"))
        amount = Decimal(self.request.data.get("amount_paid"))
        remaining = max(Decimal("0"), installment.outstanding_amount - amount)
        installment.paid_amount += amount
        installment.outstanding_amount = remaining
        if remaining == 0:
            installment.status = "paid"
        elif remaining < installment.total_due:
            installment.status = "partial"
        installment.save()
        serializer.save(remaining_balance=remaining)

