"""Platform administration endpoints.

Everything here is administrators-only and reads across every business, which
is what separates it from the rest of the API: each other endpoint is scoped to
the signed-in owner's own shop.

Kept apart from views.py because these answer a different question — how the
platform is doing, rather than who is signed in.
"""

from datetime import timedelta

from django.db.models import Count, Max, Sum
from django.db.models.functions import TruncDate
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from business.models import Business
from categories.models import Category
from inventory.models import Inventory
from products.models import Product
from sales.models import Sales
from suppliers.models import Supplier

from .models import User
from .permissions import IsAdminRole
from .serializers import AdminUserUpdateSerializer, UserSerializer

EMPTY_STATS = {
    "products": 0,
    "suppliers": 0,
    "categories": 0,
    "sales_records": 0,
    "revenue": 0.0,
    "last_sale_date": None,
}


def collect_business_stats():
    """Per-business totals, keyed by business id.

    Two queries rather than one: counting products, suppliers and categories
    across three joins already multiplies rows, and summing sale amounts in the
    same query would count each sale once per matching row.
    """
    stats = {}
    catalogue = Business.objects.values("id").annotate(
        products=Count("products", distinct=True),
        suppliers=Count("suppliers", distinct=True),
        categories=Count("categories", distinct=True),
    )
    for row in catalogue:
        stats[row["id"]] = {
            "products": row["products"],
            "suppliers": row["suppliers"],
            "categories": row["categories"],
            "sales_records": 0,
            "revenue": 0.0,
            "last_sale_date": None,
        }

    sales = Sales.objects.values("product__business_id").annotate(
        records=Count("id"),
        revenue=Sum("total_amount"),
        last_sale=Max("sale_date"),
    )
    for row in sales:
        entry = stats.get(row["product__business_id"])
        if entry is None:
            continue
        entry["sales_records"] = row["records"]
        entry["revenue"] = float(row["revenue"] or 0)
        entry["last_sale_date"] = row["last_sale"].isoformat() if row["last_sale"] else None

    return stats


def serialize_business(business, stats):
    """A business as the admin console shows it, with its totals attached."""
    return {
        "id": business.id,
        "shop_name": business.shop_name,
        "shop_type": business.shop_type,
        "address": business.address,
        "phone": business.phone,
        "gst_number": business.gst_number,
        "created_at": business.created_at.isoformat(),
        "stats": stats.get(business.id, dict(EMPTY_STATS)),
    }


class AdminOverviewView(APIView):
    """Platform-wide totals for the admin command centre."""

    permission_classes = (IsAdminRole,)

    def get(self, request):
        today = timezone.localdate()
        week_start = today - timedelta(days=6)

        accounts = User.objects.all()
        # A business counts as active once it holds products; an account that
        # registered and never imported anything is not using the platform yet.
        businesses_with_products = (
            Product.objects.values("business_id").distinct().count()
        )
        revenue = Sales.objects.aggregate(total=Sum("total_amount"))["total"] or 0

        # Registrations per day for the last seven days, zero-filled so the
        # chart keeps a full week even on quiet days.
        counted = {
            row["day"]: row["total"]
            for row in accounts.annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(total=Count("id"))
        }
        signups = []
        for offset in range(7):
            day = week_start + timedelta(days=offset)
            signups.append({"date": day.isoformat(), "count": counted.get(day, 0)})

        data = {
            "accounts": {
                "total": accounts.count(),
                "admins": accounts.filter(role=User.Role.ADMIN).count(),
                "owners": accounts.filter(role=User.Role.USER).count(),
                "inactive": accounts.filter(is_active=False).count(),
                "joined_today": counted.get(today, 0),
                "joined_last_7_days": sum(entry["count"] for entry in signups),
            },
            "businesses": {
                "total": Business.objects.count(),
                "with_products": businesses_with_products,
            },
            "catalogue": {
                "products": Product.objects.count(),
                "suppliers": Supplier.objects.count(),
                "categories": Category.objects.count(),
                "inventory_records": Inventory.objects.count(),
            },
            "sales": {
                "records": Sales.objects.count(),
                "revenue": float(revenue),
            },
            "signups": signups,
        }
        return Response({"status": True, "message": "Success", "data": data})


class AdminAccountListView(APIView):
    """Every account, with its shop and what that shop holds.

    Richer than /auth/users/, which stays as the plain account list: this one
    carries the business and its totals so the console can show an account
    without asking for each one separately.
    """

    permission_classes = (IsAdminRole,)

    def get(self, request):
        stats = collect_business_stats()
        accounts = (
            User.objects.select_related("business")
            .all()
            .order_by("-created_at")
        )

        data = []
        for account in accounts:
            # `business` is a OneToOne, so an account without one raises rather
            # than returning None.
            shop = getattr(account, "business", None)
            data.append(
                {
                    "id": account.id,
                    "full_name": account.full_name,
                    "email": account.email,
                    "role": account.role,
                    "is_active": account.is_active,
                    "created_at": account.created_at.isoformat(),
                    "last_login": account.last_login.isoformat() if account.last_login else None,
                    "business": serialize_business(shop, stats) if shop else None,
                }
            )

        return Response({"status": True, "message": "Success", "data": data})


class AdminBusinessListView(APIView):
    """Every business on the platform, with its owner and its totals."""

    permission_classes = (IsAdminRole,)

    def get(self, request):
        stats = collect_business_stats()
        businesses = Business.objects.select_related("owner").order_by("shop_name")

        data = []
        for business in businesses:
            entry = serialize_business(business, stats)
            entry["owner"] = {
                "id": business.owner_id,
                "full_name": business.owner.full_name,
                "email": business.owner.email,
                "role": business.owner.role,
                "is_active": business.owner.is_active,
            }
            data.append(entry)

        return Response({"status": True, "message": "Success", "data": data})


class AdminUserDetailView(APIView):
    """Change another account's role or active state.

    An administrator cannot demote or deactivate themselves. Nothing stops the
    last administrator being demoted by another one, but self-service lockout
    is the mistake that actually happens.
    """

    permission_classes = (IsAdminRole,)

    def patch(self, request, user_id):
        account = User.objects.filter(pk=user_id).first()
        if account is None:
            payload = {"status": False, "message": "That account does not exist.", "errors": {}}
            return Response(payload, status=status.HTTP_404_NOT_FOUND)

        if account.pk == request.user.pk:
            payload = {
                "status": False,
                "message": "Validation Error",
                "errors": {"user": ["You cannot change your own role or access."]},
            }
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        serializer = AdminUserUpdateSerializer(account, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        account = serializer.save()

        payload = {
            "status": True,
            "message": "Account updated successfully.",
            "data": UserSerializer(account).data,
        }
        return Response(payload)
