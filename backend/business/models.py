from django.conf import settings
from django.db import models


class Business(models.Model):
    """Shop information owned by one authenticated user."""

    owner = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="business",
    )
    shop_name = models.CharField(max_length=255)
    shop_type = models.CharField(max_length=100)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    gst_number = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.shop_name
