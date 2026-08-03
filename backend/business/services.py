from typing import Any

from .models import Business


class BusinessService:
    """Business-layer operations for shop information."""

    @staticmethod
    def get_business_for_owner(owner: Any) -> Business:
        """Return the business owned by the supplied authenticated user."""
        return Business.objects.get(owner=owner)

    @staticmethod
    def create_business(owner: Any, validated_data: dict[str, Any]) -> Business:
        """Create a business and associate it with its authenticated owner."""
        return Business.objects.create(owner=owner, **validated_data)

    @staticmethod
    def update_business(business: Business, validated_data: dict[str, Any]) -> Business:
        """Persist validated editable fields for an existing business."""
        for field_name, value in validated_data.items():
            setattr(business, field_name, value)

        business.save()
        return business
