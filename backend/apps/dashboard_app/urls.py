from django.urls import path

from .views import KpiView

urlpatterns = [
    path("kpis", KpiView.as_view(), name="dashboard-kpis"),
]

