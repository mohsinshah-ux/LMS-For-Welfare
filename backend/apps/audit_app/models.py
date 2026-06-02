from django.conf import settings
from django.db import models


class AuditLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=120)
    entity_type = models.CharField(max_length=100, blank=True, null=True)
    entity_id = models.CharField(max_length=64, blank=True, null=True)
    old_values = models.JSONField(blank=True, null=True)
    new_values = models.JSONField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    device_info = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

