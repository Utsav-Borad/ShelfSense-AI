"""Convert product analytics outputs into actionable inventory advice."""

from dataclasses import dataclass
from datetime import datetime, timezone

from analytics.services.analytics_engine import ProductAnalyticsEngine


@dataclass(frozen=True)
class RecommendationThresholds:
    """Configurable business thresholds for recommendation rules."""

    dead_stock_max_predicted_quantity: float = 2.0


class RecommendationEngine:
    """Generate one prioritized recommendation from a product insight."""

    def __init__(self, analytics_engine=None, thresholds=None):
        self.analytics_engine = analytics_engine or ProductAnalyticsEngine()
        self.thresholds = thresholds or RecommendationThresholds()

    @staticmethod
    def _result(product_id, recommendation_type, message, priority):
        return {
            "product_id": product_id,
            "recommendation_type": recommendation_type,
            "recommendation_message": message,
            "recommendation_priority": priority,
            "recommendation_timestamp": datetime.now(timezone.utc).isoformat(),
        }

    def recommend_from_analytics(self, analytics_result):
        """Create a recommendation using an existing analytics result."""
        required_fields = {
            "product_id",
            "predicted_quantity",
            "stock_status",
            "expiry_status",
        }
        missing_fields = required_fields - analytics_result.keys()
        if missing_fields:
            missing = ", ".join(sorted(missing_fields))
            raise ValueError(f"Analytics result is missing: {missing}.")

        product_id = analytics_result["product_id"]
        predicted_quantity = float(analytics_result["predicted_quantity"])
        stock_status = analytics_result["stock_status"]
        expiry_status = analytics_result["expiry_status"]

        if expiry_status == "EXPIRED":
            return self._result(
                product_id,
                "NEAR_EXPIRY_ACTION",
                "Remove expired inventory from sale and investigate the loss.",
                "CRITICAL",
            )

        if expiry_status == "NEAR_EXPIRY":
            return self._result(
                product_id,
                "NEAR_EXPIRY_ACTION",
                "Prioritize sale or apply a controlled discount before expiry.",
                "HIGH",
            )

        if (
            stock_status == "OVERSTOCK"
            and predicted_quantity
            <= self.thresholds.dead_stock_max_predicted_quantity
        ):
            return self._result(
                product_id,
                "DEAD_STOCK_ACTION",
                "Pause replenishment and reduce stock through promotion or bundling.",
                "HIGH",
            )

        if stock_status == "LOW_STOCK":
            return self._result(
                product_id,
                "RESTOCK",
                "Reorder soon to cover the predicted product demand.",
                "HIGH",
            )

        if stock_status == "OVERSTOCK":
            return self._result(
                product_id,
                "OVERSTOCK_REDUCTION",
                "Reduce the next purchase quantity and promote existing stock.",
                "MEDIUM",
            )

        return self._result(
            product_id,
            "HEALTHY_INVENTORY",
            "Inventory is healthy; continue monitoring demand and expiry.",
            "LOW",
        )

    def analyze_and_recommend(self, raw_features):
        """Analyze raw product input once, then return its recommendation."""
        analytics_result = self.analytics_engine.analyze_product(raw_features)
        return self.recommend_from_analytics(analytics_result)
