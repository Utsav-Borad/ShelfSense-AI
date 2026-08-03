from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User


@admin.register(User)
class ShelfSenseUserAdmin(UserAdmin):
    model = User
    list_display = ("email", "full_name", "role", "is_active", "created_at")
    ordering = ("email",)
    search_fields = ("email", "full_name")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("full_name", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "created_at")}),
    )
    readonly_fields = ("created_at",)
    add_fieldsets = ((None, {"classes": ("wide",), "fields": ("email", "full_name", "password1", "password2")}),)
