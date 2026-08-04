from django.contrib import admin

from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("category_name", "business", "description")
    search_fields = ("category_name", "description")
    list_filter = ("business",)
