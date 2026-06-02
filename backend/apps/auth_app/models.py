from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    branch = models.CharField(max_length=120, blank=True, null=True)


class Role(models.Model):
    code = models.CharField(max_length=80, unique=True)
    name = models.CharField(max_length=120)

    def __str__(self) -> str:
        return self.name


class Permission(models.Model):
    code = models.CharField(max_length=120, unique=True)
    name = models.CharField(max_length=160)
    module = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.code


class UserRole(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("user", "role")


class RolePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("role", "permission")

