"""
feature_engineering.py

Creates new features from cleaned datasets
for Machine Learning models.
"""

import pandas as pd
from datetime import datetime


class FeatureEngineer:

    @staticmethod
    def engineer_products(df):
        """Create product features."""

        df = df.copy()

        today = pd.Timestamp.today()

        df["expiry_date"] = pd.to_datetime(df["expiry_date"])

        df["days_until_expiry"] = (
            df["expiry_date"] - today
        ).dt.days

        return df

    @staticmethod
    def engineer_inventory(df):
        """Create inventory features."""

        df = df.copy()

        df["usable_stock"] = (
            df["available_quantity"]
            - df["reserved_quantity"]
            - df["damaged_quantity"]
        )

        return df

    @staticmethod
    def engineer_sales(df):
        """Create sales features."""

        df = df.copy()

        df["daily_revenue"] = (
            df["quantity_sold"]
            * df["selling_price"]
        ) - df["discount"]

        return df

    @staticmethod
    def engineer_all(data):

        return {
            "products": FeatureEngineer.engineer_products(data["products"]),
            "inventory": FeatureEngineer.engineer_inventory(data["inventory"]),
            "sales": FeatureEngineer.engineer_sales(data["sales"]),
            "suppliers": data["suppliers"],
            "categories": data["categories"],
            "businesses": data["businesses"],
        }