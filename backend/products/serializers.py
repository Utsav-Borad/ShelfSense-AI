from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Serialize product records and validate editable product information."""

    class Meta:
        model = Product
        fields = (
            "id",
            "business",
            "category",
            "supplier",
            "barcode",
            "product_name",
            "brand",
            "unit",
            "mrp",
            "selling_price",
            "manufacturing_date",
            "expiry_date",
            "minimum_stock",
            "status",
        )
        read_only_fields = ("id", "business")
        
