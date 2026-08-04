from typing import Any

from business.models import Business

from .models import Category


class CategoryService:
    """Business-layer operations for categories."""

    @staticmethod
    def get_categories_for_business(business: Business) -> list[Category]:
        """Return all categories belonging to the supplied business."""
        return list(Category.objects.filter(business=business).order_by("id"))

    @staticmethod
    def get_category_for_business(business: Business, category_id: int) -> Category:
        """Return a single category for the supplied business."""
        return Category.objects.get(business=business, id=category_id)

    @staticmethod
    def create_category(business: Business, validated_data: dict[str, Any]) -> Category:
        """Create a category and attach it to the supplied business."""
        return Category.objects.create(business=business, **validated_data)

    @staticmethod
    def update_category(category: Category, validated_data: dict[str, Any]) -> Category:
        """Persist validated editable fields for an existing category."""
        for field_name, value in validated_data.items():
            setattr(category, field_name, value)

        category.save()
        return category

    @staticmethod
    def delete_category(category: Category) -> None:
        """Delete the supplied category."""
        category.delete()
