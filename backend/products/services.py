from typing import Any

from business.models import Business

from .models import Product


class ProductService:
    """Business-layer operations for products."""

    @staticmethod
    def get_products_for_business(business: Business) -> list[Product]:
        """Return all products belonging to the supplied business."""
        return list(Product.objects.filter(business=business).order_by("id"))

    @staticmethod
    def get_product_for_business(business: Business, product_id: int) -> Product:
        """Return a single product for the supplied business."""
        return Product.objects.get(business=business, id=product_id)

    @staticmethod
    def get_product_by_barcode(business: Business, barcode: str) -> Product | None:
        """Return a product for the supplied business by barcode if it exists."""
        return Product.objects.filter(business=business, barcode=barcode).first()

    @staticmethod
    def product_exists(business: Business, product_id: int) -> bool:
        """Return whether a product exists for the supplied business."""
        return Product.objects.filter(business=business, id=product_id).exists()

    @staticmethod
    def create_product(business: Business, validated_data: dict[str, Any]) -> Product:
        """Create a product and attach it to the supplied business."""
        return Product.objects.create(business=business, **validated_data)

    @staticmethod
    def update_product(product: Product, validated_data: dict[str, Any]) -> Product:
        """Persist validated editable fields for an existing product."""
        for field_name, value in validated_data.items():
            setattr(product, field_name, value)

        product.save()
        return product

    @staticmethod
    def delete_product(product: Product) -> None:
        """Delete the supplied product."""
        product.delete()
