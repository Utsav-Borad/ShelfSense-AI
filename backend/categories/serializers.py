from rest_framework import serializers

from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    """Serialize category records and validate editable category information."""

    class Meta:
        model = Category
        fields = (
            "id",
            "business",
            "category_name",
            "description",
        )
        read_only_fields = ("id", "business")
