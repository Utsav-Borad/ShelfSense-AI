from rest_framework import serializers

from .models import Sales


class SalesSerializer(serializers.ModelSerializer):
    """Serialize sales records for read-only sales APIs."""

    class Meta:
        model = Sales
        fields = (
            "id",
            "product",
            "invoice_number",
            "sale_date",
            "quantity_sold",
            "selling_price",
            "discount",
            "total_amount",
        )
        read_only_fields = fields