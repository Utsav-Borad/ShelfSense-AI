from django.contrib import admin

from .models import Sales


@admin.register(Sales)
class SalesAdmin(admin.ModelAdmin):
    list_display = (
        "invoice_number",
        "product",
        "sale_date",
        "quantity_sold",
        "selling_price",
        "discount",
        "total_amount",
    )

    search_fields = (
        "invoice_number",
        "product__product_name",
        "product__barcode",
    )

    list_filter = (
        "sale_date",
    )

    list_select_related = (
        "product",
    )

    ordering = (
        "-sale_date",
    )