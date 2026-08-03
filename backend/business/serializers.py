from rest_framework import serializers

from .models import Business


class BusinessSerializer(serializers.ModelSerializer):
    """Serialize Business records and validate editable shop information."""

    class Meta:
        model = Business
        fields = (
            "id",
            "owner",
            "shop_name",
            "shop_type",
            "address",
            "phone",
            "gst_number",
            "created_at",
        )
        read_only_fields = ("id", "owner", "created_at")
