from django.contrib import admin

from .models import Supplier


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ("supplier_name", "business", "phone", "email", "status")
    search_fields = ("supplier_name", "phone", "email")
    list_filter = ("status", "business")
    ordering = ("supplier_name",)
