from django.db.models import Sum
from rest_framework import permissions, views
from rest_framework.response import Response

from apps.financing_app.models import FinancingApplication, Installment
from apps.payment_app.models import Payment


class KpiView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total_portfolio = FinancingApplication.objects.aggregate(
            total=Sum("financing_amount")
        )["total"] or 0
        active_count = FinancingApplication.objects.filter(status="active").count()
        overdue_installments = Installment.objects.filter(status="overdue").count()
        profit_generated = Payment.objects.aggregate(total=Sum("profit_portion"))["total"] or 0
        return Response(
            {
                "totalFinancingPortfolio": float(total_portfolio),
                "activeFinancing": active_count,
                "overdueInstallments": overdue_installments,
                "profitGenerated": float(profit_generated),
            }
        )

