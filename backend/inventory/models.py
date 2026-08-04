from django.db import models

from products.models import Product


class Inventory(models.Model):
    """Current stock snapshot for a product."""

    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name="inventory",
    )
    available_quantity = models.PositiveIntegerField(default=0)
    reserved_quantity = models.PositiveIntegerField(default=0)
    damaged_quantity = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.product_name} inventory"
    
    class Meta:
        ordering = ["product__product_name"]
