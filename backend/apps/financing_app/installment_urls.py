from django.urls import path

from .views import InstallmentGenerateView, InstallmentListView

urlpatterns = [
    path("", InstallmentListView.as_view(), name="installment-list"),
    path("generate", InstallmentGenerateView.as_view(), name="installment-generate"),
]

