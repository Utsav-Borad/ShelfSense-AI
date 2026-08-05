"""Reusable, Django-independent demand forecasting using saved artifacts."""

from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd


class DemandForecastEngine:
    """Predict product demand from raw product and business feature values."""

    ARTIFACT_DIRECTORY = Path(__file__).resolve().parents[1] / "trained_models"
    MODEL_PATH = ARTIFACT_DIRECTORY / "decision_tree.pkl"
    PREPROCESSING_PATH = ARTIFACT_DIRECTORY / "decision_tree_preprocessing.pkl"

    # Reading the saved decision tree off disk costs far more than using it, and
    # the artifacts never change while the server is running. They are loaded
    # once per file path and shared by every engine instance afterwards.
    _ARTIFACT_CACHE = {}

    @classmethod
    def _load_artifacts(cls, model_path, preprocessing_path):
        key = (str(model_path), str(preprocessing_path))
        if key not in cls._ARTIFACT_CACHE:
            cls._ARTIFACT_CACHE[key] = (
                joblib.load(model_path),
                joblib.load(preprocessing_path),
            )
        return cls._ARTIFACT_CACHE[key]

    def __init__(self, model_path=None, preprocessing_path=None):
        self.model_path = Path(model_path or self.MODEL_PATH)
        self.preprocessing_path = Path(
            preprocessing_path or self.PREPROCESSING_PATH
        )
        self.model, self.preprocessing_pipeline = self._load_artifacts(
            self.model_path,
            self.preprocessing_path,
        )

    @staticmethod
    def _numeric(value):
        try:
            return float(value)
        except (TypeError, ValueError):
            return np.nan

    @staticmethod
    def _ratio(numerator, denominator):
        if pd.isna(numerator) or pd.isna(denominator) or denominator == 0:
            return 0.0
        return numerator / denominator

    def _engineer_input(self, raw_features):
        """Derive the training-time feature values from one raw input mapping."""
        data = dict(raw_features)
        if "product_id" not in data:
            raise ValueError("'product_id' is required for demand forecasting.")

        available = self._numeric(data.get("available_quantity"))
        reserved = self._numeric(data.get("reserved_quantity"))
        damaged = self._numeric(data.get("damaged_quantity"))
        total_stock = self._numeric(data.get("total_stock"))
        if pd.isna(total_stock):
            total_stock = available + reserved + damaged

        selling_price = self._numeric(data.get("selling_price"))
        selling_price_sale = self._numeric(data.get("selling_price_sale"))
        if pd.isna(selling_price_sale):
            selling_price_sale = selling_price
        mrp = self._numeric(data.get("mrp"))
        minimum_stock = self._numeric(data.get("minimum_stock"))

        forecast_date = pd.Timestamp(
            data.get("forecast_date", datetime.now(timezone.utc))
        )
        if forecast_date.tzinfo is not None:
            forecast_date = forecast_date.tz_localize(None)
        forecast_date = forecast_date.normalize()

        days_to_expiry = self._numeric(data.get("days_to_expiry"))
        if pd.isna(days_to_expiry) and data.get("expiry_date") is not None:
            expiry_date = pd.to_datetime(data["expiry_date"], errors="coerce")
            if not pd.isna(expiry_date):
                days_to_expiry = (expiry_date.normalize() - forecast_date).days

        derived_features = {
            "selling_price_sale": selling_price_sale,
            "total_stock": total_stock,
            "inventory_value": available * selling_price,
            "reserved_ratio": self._ratio(reserved, total_stock),
            "damaged_ratio": self._ratio(damaged, total_stock),
            "available_ratio": self._ratio(available, total_stock),
            "days_to_expiry": days_to_expiry,
            "expired": int(days_to_expiry < 0) if not pd.isna(days_to_expiry) else np.nan,
            "near_expiry": (
                int(days_to_expiry <= 30)
                if not pd.isna(days_to_expiry)
                else np.nan
            ),
            "day": forecast_date.day,
            "month": forecast_date.month,
            "weekday": forecast_date.weekday(),
            "week_of_year": float(forecast_date.isocalendar().week),
            "is_weekend": int(forecast_date.weekday() >= 5),
            "profit_per_unit": selling_price_sale - mrp,
            "usable_stock": available - reserved - damaged,
            "stock_difference": available - minimum_stock,
            "low_stock": int(available <= minimum_stock),
            "overstock": int(available >= minimum_stock * 3),
        }
        data.update(derived_features)
        return data

    def predict(self, raw_features):
        """Preprocess one raw product input and return a demand forecast."""
        data = self._engineer_input(raw_features)
        expected_columns = self.preprocessing_pipeline.feature_names_in_
        feature_frame = pd.DataFrame([
            {column: data.get(column, np.nan) for column in expected_columns}
        ])

        transformed_features = self.preprocessing_pipeline.transform(
            feature_frame
        )
        prediction = float(self.model.predict(transformed_features)[0])

        return {
            "product_id": data["product_id"],
            "predicted_quantity": max(0.0, round(prediction, 2)),
            "model_name": type(self.model).__name__,
            "prediction_timestamp": datetime.now(timezone.utc).isoformat(),
        }
