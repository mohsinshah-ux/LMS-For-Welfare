from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("apps.auth_app.urls")),
    path("customers/", include("apps.customer_app.urls")),
    path("financing-applications/", include("apps.financing_app.urls")),
    path("installments/", include("apps.financing_app.installment_urls")),
    path("payments/", include("apps.payment_app.urls")),
    path("dashboard/", include("apps.dashboard_app.urls")),
]

