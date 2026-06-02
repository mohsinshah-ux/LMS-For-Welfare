from decimal import Decimal

from rest_framework import generics, permissions

from apps.financing_app.models import Installment

from .models import Payment
from .serializers import PaymentSerializer


class PaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all().order_by("-created_at")
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        installment_id = self.request.data.get("installmentId") or self.request.data.get("installment")
        installment = Installment.objects.get(pk=installment_id)
        amount = Decimal(str(self.request.data.get("amountPaid") or self.request.data.get("amount_paid")))
        remaining = max(Decimal("0"), installment.outstanding_amount - amount)
        installment.paid_amount += amount
        installment.outstanding_amount = remaining
        if remaining == 0:
            installment.status = "paid"
        elif installment.paid_amount > 0:
            installment.status = "partial"
        installment.save()
        serializer.save(
            installment=installment,
            remaining_balance=remaining,
            principal_portion=amount,
        )
