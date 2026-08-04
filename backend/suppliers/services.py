from typing import Any

from business.models import Business

from .models import Supplier


class SupplierService:
    """Business-layer operations for suppliers."""

    @staticmethod
    def get_suppliers_for_business(business: Business) -> list[Supplier]:
        """Return all suppliers belonging to the supplied business."""
        return list(Supplier.objects.filter(business=business).order_by("id"))

    @staticmethod
    def get_supplier_for_business(business: Business, supplier_id: int) -> Supplier:
        """Return a single supplier for the supplied business."""
        return Supplier.objects.get(business=business, id=supplier_id)

    @staticmethod
    def create_supplier(business: Business, validated_data: dict[str, Any]) -> Supplier:
        """Create a supplier and attach it to the supplied business."""
        return Supplier.objects.create(business=business, **validated_data)

    @staticmethod
    def update_supplier(supplier: Supplier, validated_data: dict[str, Any]) -> Supplier:
        """Persist validated editable fields for an existing supplier."""
        for field_name, value in validated_data.items():
            setattr(supplier, field_name, value)

        supplier.save()
        return supplier

    @staticmethod
    def delete_supplier(supplier: Supplier) -> None:
        """Delete the supplied supplier."""
        supplier.delete()
