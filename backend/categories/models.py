from django.db import models

from business.models import Business


class Category(models.Model):
    """Category information linked to a business."""

    business = models.ForeignKey(
        Business,
        on_delete=models.CASCADE,
        related_name="categories",
    )
    category_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.category_name
