from django.urls import path

from .views import FinancingApplicationListCreateView, FinancingApplicationStatusUpdateView

urlpatterns = [
    path("", FinancingApplicationListCreateView.as_view(), name="financing-list-create"),
    path("<int:pk>/status", FinancingApplicationStatusUpdateView.as_view(), name="financing-status-update"),
]

