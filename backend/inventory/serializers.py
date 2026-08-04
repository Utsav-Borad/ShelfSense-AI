from rest_framework import serializers

from .models import Inventory


class InventorySerializer(serializers.ModelSerializer):
    """Serialize inventory records for read-only inventory APIs."""

    class Meta:
        model = Inventory
        fields = (
            "id",
            "product",
            "available_quantity",
            "reserved_quantity",
            "damaged_quantity",
            "last_updated",
        )
        read_only_fields = fields