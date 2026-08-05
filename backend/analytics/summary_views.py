"""REST endpoints for the analytics dashboards.

These are aggregation views over the live tables, with the AI health mix layered
on where it adds meaning. They are read-only and always business-scoped.
"""

from datetime import timedelta

import pandas as pd
from django.db.models import Count, DecimalField, F, Sum
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from inventory.models import Inventory
from products.models import Product
from sales.models import Sales
from suppliers.models import Supplier

from .api_base import BusinessInsightsView, require_business, success
from .services.insights import latest_sale_date

REVENUE_WINDOW_DAYS = 30


def _sales_frame(business, days=REVENUE_WINDOW_DAYS):
    """Sales for the last `days` days as a numeric DataFrame.

    The window ends at the most recent sale rather than today, so imported
    history still produces a chart. See `insights.latest_sale_date`.
    """
    end_date = latest_sale_date(business)
    start_date = end_date - timedelta(days=days - 1)
    records = list(
        Sales.objects.filter(
            product__business=business,
            sale_date__gte=start_date,
            sale_date__lte=end_date,
        ).values(
            "id",
            "sale_date",
            "quantity_sold",
            "total_amount",
            "product__product_name",
        )
    )
    columns = ["id", "sale_date", "quantity_sold", "total_amount", "product__product_name"]
    frame = pd.DataFrame(records, columns=columns)
    if frame.empty:
        return frame

    frame["sale_date"] = pd.to_datetime(frame["sale_date"], errors="coerce")
    for column in ("quantity_sold", "total_amount"):
        frame[column] = pd.to_numeric(frame[column], errors="coerce").fillna(0.0)
    return frame.dropna(subset=["sale_date"])


def _stock_value(business):
    """Value of available stock at selling price.

    quantity is an integer and price is a decimal, so Django needs to be told
    what the product of the two should be.
    """
    total = Inventory.objects.filter(product__business=business).aggregate(
        value=Sum(
            F("available_quantity") * F("product__selling_price"),
            output_field=DecimalField(max_digits=14, decimal_places=2),
        )
    )["value"]
    return round(float(total or 0), 2)


def _health_mix(results):
    """Count how many analysed products fall into each health band."""
    mix = {}
    for result in results:
        key = result["analytics"]["inventory_health"]
        mix[key] = mix.get(key, 0) + 1
    return mix


class DashboardView(BusinessInsightsView):
    """One call that fills the decision dashboard's headline figures."""

    def build_response(self, request, business, results):
        frame = _sales_frame(business)
        revenue = round(float(frame["total_amount"].sum()), 2) if not frame.empty else 0.0

        stock_statuses = [result["analytics"]["stock_status"] for result in results]
        expiry_statuses = [result["analytics"]["expiry_status"] for result in results]

        return success(
            {
                "products": Product.objects.filter(business=business).count(),
                "suppliers": Supplier.objects.filter(business=business).count(),
                "stock_value": _stock_value(business),
                "revenue_last_30_days": revenue,
                "analysed_products": len(results),
                "low_stock": stock_statuses.count("LOW_STOCK"),
                "overstock": stock_statuses.count("OVERSTOCK"),
                "near_expiry": expiry_statuses.count("NEAR_EXPIRY"),
                "expired": expiry_statuses.count("EXPIRED"),
                "health_mix": _health_mix(results),
            },
            "Dashboard generated successfully.",
        )


class RevenueAnalyticsView(APIView):
    """Revenue per day for the last 30 days, plus the period total."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = require_business(request.user)
        frame = _sales_frame(business)
        if frame.empty:
            return success(
                {"window_days": REVENUE_WINDOW_DAYS, "total_revenue": 0.0, "series": []},
                "No sales in this period.",
            )

        daily = (
            frame.groupby(frame["sale_date"].dt.date)["total_amount"]
            .sum()
            .sort_index()
        )
        return success(
            {
                "window_days": REVENUE_WINDOW_DAYS,
                "total_revenue": round(float(frame["total_amount"].sum()), 2),
                "series": [
                    {"date": day.isoformat(), "revenue": round(float(value), 2)}
                    for day, value in daily.items()
                ],
            },
            "Revenue analytics generated successfully.",
        )


class InventoryAnalyticsView(BusinessInsightsView):
    """Stock position by AI status, with the value sitting behind it."""

    def build_response(self, request, business, results):
        buckets = {}
        for result in results:
            key = result["analytics"]["stock_status"]
            buckets[key] = buckets.get(key, 0) + 1

        totals = Inventory.objects.filter(product__business=business).aggregate(
            available=Sum("available_quantity"),
            reserved=Sum("reserved_quantity"),
            damaged=Sum("damaged_quantity"),
        )

        return success(
            {
                "stock_value": _stock_value(business),
                "available_quantity": int(totals["available"] or 0),
                "reserved_quantity": int(totals["reserved"] or 0),
                "damaged_quantity": int(totals["damaged"] or 0),
                "status_breakdown": buckets,
            },
            "Inventory analytics generated successfully.",
        )


class TrendsAnalyticsView(APIView):
    """Units sold per day and the five fastest-moving products."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = require_business(request.user)
        frame = _sales_frame(business)
        if frame.empty:
            return success(
                {"window_days": REVENUE_WINDOW_DAYS, "series": [], "top_movers": []},
                "No sales in this period.",
            )

        daily = (
            frame.groupby(frame["sale_date"].dt.date)["quantity_sold"]
            .sum()
            .sort_index()
        )
        movers = (
            frame.groupby("product__product_name")["quantity_sold"]
            .sum()
            .sort_values(ascending=False)
            .head(5)
        )

        return success(
            {
                "window_days": REVENUE_WINDOW_DAYS,
                "series": [
                    {"date": day.isoformat(), "units_sold": int(value)}
                    for day, value in daily.items()
                ],
                "top_movers": [
                    {"product_name": name, "units_sold": int(value)}
                    for name, value in movers.items()
                ],
            },
            "Trend analytics generated successfully.",
        )


class SupplierAnalyticsView(APIView):
    """Supplier footprint: how much of the catalogue and stock each one covers."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = require_business(request.user)
        # Product.supplier uses related_name="products" and Inventory.product
        # uses related_name="inventory", so one product contributes at most one
        # inventory row and the sums cannot double count.
        rows = (
            Supplier.objects.filter(business=business)
            .values("id", "supplier_name", "status")
            .annotate(
                # Named product_count, not products: an annotation alias that
                # matches the relation name shadows it for the joins below.
                product_count=Count("products", distinct=True),
                stock_value=Sum(
                    F("products__inventory__available_quantity")
                    * F("products__selling_price"),
                    output_field=DecimalField(max_digits=14, decimal_places=2),
                ),
                available_quantity=Sum("products__inventory__available_quantity"),
            )
            .order_by("supplier_name")
        )

        suppliers = [
            {
                "id": row["id"],
                "supplier_name": row["supplier_name"],
                "status": row["status"],
                "products": row["product_count"],
                "available_quantity": int(row["available_quantity"] or 0),
                "stock_value": round(float(row["stock_value"] or 0), 2),
            }
            for row in rows
        ]

        return success(
            {"count": len(suppliers), "suppliers": suppliers},
            "Supplier analytics generated successfully.",
        )
