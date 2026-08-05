"""REST endpoints for the AI advisory engines.

Every recommendation here is produced by `analytics/recommendation/` and is
advisory only — none of these endpoints write to the database. The reorder,
discount and dead-stock views are the same recommendation set filtered by type,
so one pipeline run answers all of them consistently.
"""

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from analytics.api_base import (
    BusinessInsightsView,
    require_business,
    success,
    unavailable,
)
from analytics.ml.inventory_loss import analyze_inventory_loss
from analytics.services.insights import get_product_ids, product_names

PRIORITY_ORDER = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}


def _recommendations(results, names):
    """Flatten pipeline results into labelled, priority-sorted advice."""
    advice = []
    for result in results:
        recommendation = dict(result["recommendation"])
        analytics = result["analytics"]
        recommendation["product_name"] = names.get(
            recommendation["product_id"],
            "Unknown product",
        )
        recommendation["current_stock"] = analytics["current_stock"]
        recommendation["predicted_quantity"] = analytics["predicted_quantity"]
        recommendation["stock_status"] = analytics["stock_status"]
        recommendation["expiry_status"] = analytics["expiry_status"]
        recommendation["inventory_health"] = analytics["inventory_health"]
        advice.append(recommendation)

    advice.sort(
        key=lambda item: PRIORITY_ORDER.get(
            item["recommendation_priority"],
            len(PRIORITY_ORDER),
        )
    )
    return advice


class RecommendationListView(BusinessInsightsView):
    """Every recommendation for this business, most urgent first."""

    def build_response(self, request, business, results):
        advice = _recommendations(results, product_names(business))
        counts = {}
        for item in advice:
            key = item["recommendation_type"]
            counts[key] = counts.get(key, 0) + 1

        return success(
            {
                "count": len(advice),
                "counts_by_type": counts,
                "recommendations": advice,
            },
            "Recommendations generated successfully.",
        )


class _FilteredRecommendationView(BusinessInsightsView):
    """Base view for a single recommendation type."""

    recommendation_type = ""
    message = "Recommendations generated successfully."

    def build_response(self, request, business, results):
        advice = [
            item
            for item in _recommendations(results, product_names(business))
            if item["recommendation_type"] == self.recommendation_type
        ]
        return success(
            {"count": len(advice), "recommendations": advice},
            self.message,
        )


class ReorderView(_FilteredRecommendationView):
    """Products the model expects to run short before the next cycle."""

    recommendation_type = "RESTOCK"
    message = "Reorder suggestions generated successfully."


class DiscountView(_FilteredRecommendationView):
    """Products worth discounting because expiry is close."""

    recommendation_type = "NEAR_EXPIRY_ACTION"
    message = "Discount suggestions generated successfully."


class DeadStockView(_FilteredRecommendationView):
    """Overstocked products with almost no predicted demand."""

    recommendation_type = "DEAD_STOCK_ACTION"
    message = "Dead stock analysis generated successfully."


class InventoryLossView(APIView):
    """Damaged-stock loss percentages, classified and scoped to the business."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = require_business(request.user)
        names = product_names(business)
        owned_product_ids = get_product_ids(business)

        try:
            frame = analyze_inventory_loss()
        except (KeyError, ValueError) as error:
            return unavailable(error)

        if frame.empty:
            return success(
                {"count": 0, "total_damaged_units": 0, "items": []},
                "No inventory records to analyse.",
            )

        owned = frame[frame["product_id"].isin(owned_product_ids)]
        items = [
            {
                "inventory_id": int(row["id"]),
                "product_id": int(row["product_id"]),
                "product_name": names.get(int(row["product_id"]), "Unknown product"),
                "available_quantity": int(row["available_quantity"]),
                "damaged_quantity": int(row["damaged_quantity"]),
                "loss_percentage": float(row["loss_percentage"]),
                "inventory_status": row["inventory_status"],
                "recommendation": row["recommendation"],
            }
            for _, row in owned.iterrows()
        ]
        items.sort(key=lambda item: item["loss_percentage"], reverse=True)

        return success(
            {
                "count": len(items),
                "total_damaged_units": sum(item["damaged_quantity"] for item in items),
                "items": items,
            },
            "Inventory loss analysis generated successfully.",
        )
