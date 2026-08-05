"""
analytics_engine.py

Coordinates the complete Analytics pipeline.
"""

from dataclasses import dataclass
from datetime import datetime, timezone

import pandas as pd

from analytics.ml.forecast_engine import DemandForecastEngine


@dataclass(frozen=True)
class AnalyticsThresholds:
    """Configurable inventory decision thresholds."""

    low_stock_demand_coverage: float = 1.0
    overstock_demand_coverage: float = 3.0
    overstock_minimum_stock_multiplier: float = 3.0
    near_expiry_days: int = 30


class ProductAnalyticsEngine:
    """Turn a demand forecast and current product state into an insight."""

    def __init__(self, forecast_engine=None, thresholds=None):
        self.forecast_engine = forecast_engine or DemandForecastEngine()
        self.thresholds = thresholds or AnalyticsThresholds()

    @staticmethod
    def _required_number(features, field_name):
        try:
            value = float(features[field_name])
        except (KeyError, TypeError, ValueError) as error:
            raise ValueError(
                f"'{field_name}' must be supplied as a number."
            ) from error

        if value < 0:
            raise ValueError(f"'{field_name}' cannot be negative.")
        return value

    def _expiry_status(self, expiry_date, analytics_date):
        expiry_timestamp = pd.to_datetime(expiry_date, errors="coerce")
        if pd.isna(expiry_timestamp):
            raise ValueError("'expiry_date' must use ISO date format YYYY-MM-DD.")

        days_to_expiry = (expiry_timestamp.normalize() - analytics_date).days
        if days_to_expiry < 0:
            return "EXPIRED"
        if days_to_expiry <= self.thresholds.near_expiry_days:
            return "NEAR_EXPIRY"
        return "HEALTHY"

    def _stock_status(self, current_stock, minimum_stock, predicted_quantity):
        low_stock_limit = max(
            minimum_stock,
            predicted_quantity * self.thresholds.low_stock_demand_coverage,
        )
        overstock_limit = max(
            minimum_stock * self.thresholds.overstock_minimum_stock_multiplier,
            predicted_quantity * self.thresholds.overstock_demand_coverage,
        )

        if current_stock <= low_stock_limit:
            return "LOW_STOCK"
        if current_stock >= overstock_limit:
            return "OVERSTOCK"
        return "HEALTHY"

    @staticmethod
    def _inventory_health(stock_status, expiry_status):
        if stock_status == "LOW_STOCK" or expiry_status == "EXPIRED":
            return "CRITICAL"
        if stock_status == "OVERSTOCK" or expiry_status == "NEAR_EXPIRY":
            return "ATTENTION"
        return "HEALTHY"

    def analyze_product(self, raw_features, forecast=None):
        """Analyze one product using the configured business thresholds."""
        current_stock = self._required_number(
            raw_features,
            "available_quantity",
        )
        minimum_stock = self._required_number(raw_features, "minimum_stock")
        forecast = forecast or self.forecast_engine.predict(raw_features)
        predicted_quantity = forecast["predicted_quantity"]
        analytics_date = pd.Timestamp.now(tz="UTC").tz_localize(None).normalize()
        stock_status = self._stock_status(
            current_stock,
            minimum_stock,
            predicted_quantity,
        )
        expiry_status = self._expiry_status(
            raw_features.get("expiry_date"),
            analytics_date,
        )

        return {
            "product_id": forecast["product_id"],
            "predicted_quantity": predicted_quantity,
            "current_stock": current_stock,
            "stock_difference": round(current_stock - predicted_quantity, 2),
            "stock_status": stock_status,
            "expiry_status": expiry_status,
            "inventory_health": self._inventory_health(
                stock_status,
                expiry_status,
            ),
            "analytics_timestamp": datetime.now(timezone.utc).isoformat(),
        }


class AnalyticsEngine:

    @staticmethod
    def run():
        # These imports remain local so product-level analytics can be reused
        # without configuring Django or accessing the production database.
        from analytics.services.data_loader import load_all_data
        from analytics.services.feature_engineering import FeatureEngineer
        from analytics.services.preprocessing import DataPreprocessor

        # Step 1
        raw_data = load_all_data()

        # Step 2: build and clean the database-backed master dataset.
        cleaned_data = DataPreprocessor.preprocess_all(raw_data)

        # Step 3: create model-ready features. Model-specific preprocessing is
        # intentionally deferred until after the train/test split.
        engineered_data = FeatureEngineer.engineer_all(cleaned_data)

        return engineered_data

    @staticmethod
    def analyze_product(raw_features, thresholds=None):
        """Convenience entry point for product-level inventory analytics."""
        return ProductAnalyticsEngine(thresholds=thresholds).analyze_product(
            raw_features
        )
