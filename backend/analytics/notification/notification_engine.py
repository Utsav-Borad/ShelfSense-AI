"""Convert inventory recommendations into dashboard notification payloads."""

from dataclasses import dataclass
from datetime import datetime, timezone

from analytics.recommendation.recommendation_engine import RecommendationEngine


@dataclass(frozen=True)
class NotificationRules:
    """Configurable severities for dashboard notification categories."""

    low_stock_severity: str = "HIGH"
    overstock_severity: str = "MEDIUM"
    near_expiry_severity: str = "HIGH"
    dead_stock_severity: str = "HIGH"
    healthy_inventory_severity: str = "LOW"


class NotificationEngine:
    """Build dashboard-friendly notifications from recommendation outputs."""

    def __init__(self, recommendation_engine=None, rules=None):
        self.recommendation_engine = recommendation_engine or RecommendationEngine()
        self.rules = rules or NotificationRules()

    def notification_from_recommendation(self, recommendation):
        """Translate one recommendation without recalculating analytics rules."""
        required_fields = {
            "product_id",
            "recommendation_type",
            "recommendation_message",
        }
        missing_fields = required_fields - recommendation.keys()
        if missing_fields:
            missing = ", ".join(sorted(missing_fields))
            raise ValueError(f"Recommendation is missing: {missing}.")

        notification_map = {
            "RESTOCK": (
                "LOW_STOCK",
                "Low stock requires attention",
                self.rules.low_stock_severity,
            ),
            "OVERSTOCK_REDUCTION": (
                "OVERSTOCK",
                "Overstock reduction opportunity",
                self.rules.overstock_severity,
            ),
            "NEAR_EXPIRY_ACTION": (
                "NEAR_EXPIRY",
                "Expiry action required",
                self.rules.near_expiry_severity,
            ),
            "DEAD_STOCK_ACTION": (
                "DEAD_STOCK",
                "Dead stock action required",
                self.rules.dead_stock_severity,
            ),
            "HEALTHY_INVENTORY": (
                "HEALTHY_INVENTORY",
                "Inventory is healthy",
                self.rules.healthy_inventory_severity,
            ),
        }
        try:
            notification_type, title, severity = notification_map[
                recommendation["recommendation_type"]
            ]
        except KeyError as error:
            raise ValueError(
                "Unsupported recommendation type: "
                f"{recommendation['recommendation_type']}."
            ) from error

        return {
            "product_id": recommendation["product_id"],
            "notification_type": notification_type,
            "title": title,
            "message": recommendation["recommendation_message"],
            "severity": severity,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }

    def analyze_and_notify(self, raw_features):
        """Generate a recommendation once, then turn it into a notification."""
        recommendation = self.recommendation_engine.analyze_and_recommend(
            raw_features
        )
        return self.notification_from_recommendation(recommendation)
