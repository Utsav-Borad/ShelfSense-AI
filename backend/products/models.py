from django.db import models

from business.models import Business
from categories.models import Category
from suppliers.models import Supplier


class Product(models.Model):
    """Product information linked to a business, category, and supplier."""

    class Status(models.TextChoices):
        ACTIVE = "ACTIVE", "Active"
        INACTIVE = "INACTIVE", "Inactive"

    business = models.ForeignKey(
        Business,
        on_delete=models.CASCADE,
        related_name="products",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products",
    )
    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.CASCADE,
        related_name="products",
    )
    barcode = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    product_name = models.CharField(max_length=255, db_index=True)
    brand = models.CharField(max_length=255, blank=True, null=True)
    unit = models.CharField(max_length=50)
    mrp = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    manufacturing_date = models.DateField(blank=True, null=True)
    expiry_date = models.DateField(blank=True, null=True)
    minimum_stock = models.IntegerField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)

    def __str__(self):
        return self.product_name
    
    class Meta:
        indexes = [
            models.Index(fields=["business","barcode"]),
            models.Index(fields=["business", "product_name"]),
        ]
