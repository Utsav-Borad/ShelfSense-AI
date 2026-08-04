from django.db.models import F

from business.models import Business

from .models import Inventory


class InventoryService:
    """Business-layer operations for inventory."""

    @staticmethod
    def get_inventory_for_business(business: Business):
        """Return all inventory records for a business."""
        return Inventory.objects.filter(
            product__business=business
        ).order_by("product__product_name")

    @staticmethod
    def get_low_stock(business: Business):
        """Return products whose available stock is at or below the minimum stock level."""
        return Inventory.objects.filter(
            product__business=business,
            available_quantity__lte=F("product__minimum_stock"),
        ).order_by("product__product_name")

    @staticmethod
    def get_near_expiry(business: Business):
        """
        Placeholder until Purchase/CSV Synchronization provides expiry information.
        """
        return Inventory.objects.none()

    @staticmethod
    def get_dead_stock(business: Business):
        """
        Placeholder until Sales data is available.
        """
        return Inventory.objects.none()