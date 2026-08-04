from django.contrib import admin

from .models import Inventory


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "available_quantity",
        "reserved_quantity",
        "damaged_quantity",
        "last_updated",
    )

    search_fields = (
        "product__product_name",
        "product__barcode",
    )

    list_select_related = (
        "product",
    )

    ordering = (
        "product__product_name",
    )