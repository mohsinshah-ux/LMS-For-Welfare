from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from apps.auth_app.models import Permission, Role, RolePermission


class Command(BaseCommand):
    help = "Seed default super admin, roles, and permissions"

    def handle(self, *args, **options):
        user_model = get_user_model()

        permissions = [
            ("customers.create", "Create Customers", "customers"),
            ("customers.view", "View Customers", "customers"),
            ("financing_applications.create", "Create Applications", "financing"),
            ("financing_applications.view", "View Applications", "financing"),
            ("financing_applications.status.update", "Update Application Status", "financing"),
            ("dashboard.view", "View Dashboard", "dashboard"),
        ]

        for code, name, module in permissions:
            Permission.objects.update_or_create(code=code, defaults={"name": name, "module": module})

        role, _ = Role.objects.update_or_create(
            code="super_admin",
            defaults={"name": "Super Admin"},
        )

        for permission in Permission.objects.all():
            RolePermission.objects.get_or_create(role=role, permission=permission)

        user, created = user_model.objects.get_or_create(
            username="superadmin",
            defaults={"email": "admin@lms.local", "is_staff": True, "is_superuser": True},
        )
        if created or not user.has_usable_password():
            user.set_password("Admin@123")
            user.save()

        self.stdout.write(self.style.SUCCESS("LMS seed completed (superadmin / Admin@123)"))
