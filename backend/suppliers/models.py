from django.db import models

from business.models import Business


class Supplier(models.Model):
    """Supplier information linked to a business."""

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"

    business = models.ForeignKey(
        Business,
        on_delete=models.CASCADE,
        related_name="suppliers",
    )
    supplier_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    def __str__(self):
        return self.supplier_name
