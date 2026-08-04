from django.db import models

from products.models import Product


class Sales(models.Model):
    """Stores sales transactions imported through Sales CSV."""

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="sales",
    )

    invoice_number = models.CharField(
        max_length=100,
        db_index=True,
    )

    sale_date = models.DateField(
        db_index=True,
    )

    quantity_sold = models.PositiveIntegerField(
        default=0,
    )

    selling_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0,
    )

    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    def __str__(self):
        return f"{self.invoice_number} - {self.product.product_name}"

    class Meta:
        ordering = ["-sale_date"]

        indexes = [
            models.Index(fields=["product", "sale_date"]),
            models.Index(fields=["invoice_number"]),
        ]