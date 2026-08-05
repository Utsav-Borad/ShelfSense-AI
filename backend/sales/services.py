from business.models import Business

from .models import Sales


class SalesService:
    """Business-layer operations for sales."""

    @staticmethod
    def get_sales_for_business(business: Business):
        """Return all sales records for the supplied business."""
        return Sales.objects.filter(
            product__business=business
        ).order_by("-sale_date")

    @staticmethod
    def get_sales_history(business: Business):
        """Return complete sales history ordered by most recent sale."""
        return Sales.objects.filter(
            product__business=business
        ).order_by("-sale_date")

    @staticmethod
    def get_sale_by_id(business: Business, sale_id: int):
        """Return a single sales record belonging to the supplied business."""
        return Sales.objects.get(
            product__business=business,
            id=sale_id,
        )