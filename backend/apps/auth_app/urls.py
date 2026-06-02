from django.urls import path

from .views import LoginView

urlpatterns = [
    path("login", LoginView.as_view(), name="auth-login"),
    path("login/", LoginView.as_view(), name="auth-login-slash"),
]

