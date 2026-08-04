from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("product_name", "business", "category", "supplier", "status")
    search_fields = ("product_name", "brand", "barcode")
    list_filter = ("status", "business", "category", "supplier")
    ordering = ("product_name",)