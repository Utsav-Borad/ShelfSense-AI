from django.contrib import admin

from .models import Business


@admin.register(Business)
class BusinessAdmin(admin.ModelAdmin):
	list_display = ("id", "shop_name", "shop_type", "owner", "created_at")
	search_fields = ("shop_name", "shop_type", "owner__email", "owner__full_name")
	list_select_related = ("owner",)
