from datetime import date
from dateutil.relativedelta import relativedelta  # install python-dateutil if needed

from rest_framework import generics, permissions, status, views
from rest_framework.response import Response

from .models import FinancingApplication, Installment
from .serializers import FinancingApplicationSerializer, InstallmentSerializer


class FinancingApplicationListCreateView(generics.ListCreateAPIView):
    queryset = FinancingApplication.objects.all().order_by("-created_at")
    serializer_class = FinancingApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class FinancingApplicationStatusUpdateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk: int):
        try:
            app = FinancingApplication.objects.get(pk=pk)
        except FinancingApplication.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        to_status = request.data.get("toStatus")
        if not to_status:
            return Response({"detail": "toStatus is required"}, status=status.HTTP_400_BAD_REQUEST)
        app.status = to_status
        app.save(update_fields=["status"])
        return Response(FinancingApplicationSerializer(app).data)


class InstallmentListView(generics.ListAPIView):
    queryset = Installment.objects.all().order_by("due_date")
    serializer_class = InstallmentSerializer
    permission_classes = [permissions.IsAuthenticated]


class InstallmentGenerateView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        application_id = request.data.get("applicationId")
        count = int(request.data.get("count", 0))
        principal = float(request.data.get("principalPerInstallment", 0))
        profit = float(request.data.get("profitPerInstallment", 0))
        first_due_str = request.data.get("firstDueDate")
        if not (application_id and count and first_due_str):
            return Response({"detail": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            app = FinancingApplication.objects.get(pk=application_id)
        except FinancingApplication.DoesNotExist:
            return Response({"detail": "Application not found"}, status=status.HTTP_404_NOT_FOUND)
        year, month, day = map(int, first_due_str.split("-"))
        first_due = date(year, month, day)
        created = []
        for i in range(count):
            due = first_due + relativedelta(months=i)
            total = principal + profit
            created.append(
                Installment(
                    application=app,
                    installment_number=i + 1,
                    due_date=due,
                    principal_amount=principal,
                    profit_amount=profit,
                    total_due=total,
                    outstanding_amount=total,
                )
            )
        Installment.objects.bulk_create(created)
        return Response({"created": count}, status=status.HTTP_201_CREATED)

