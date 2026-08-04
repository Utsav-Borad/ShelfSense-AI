from rest_framework import serializers

from .models import Supplier


class SupplierSerializer(serializers.ModelSerializer):
    """Serialize supplier records and validate editable supplier information."""

    class Meta:
        model = Supplier
        fields = (
            "id",
            "business",
            "supplier_name",
            "phone",
            "email",
            "address",
            "status",
        )
        read_only_fields = ("id", "business")
        ordering = ["supplier_name"]
