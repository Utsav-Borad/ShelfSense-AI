"""
feature_engineering.py

Creates new features for
Machine Learning models.
"""

import numpy as np
import pandas as pd

from analytics.services.preprocessing import DataPreprocessor

class FeatureEngineer:
    """
    Creates additional features
    from the preprocessed dataset.
    """
    
    def __init__(self, dataset=None):
        if dataset is None:
            dataset = DataPreprocessor().get_dataset()

        self.dataset = dataset
        
    def engineer(self):
        """
        Create new features for
        Machine Learning.
        """

        dataset = self.dataset.copy()
        
        # ==============================
        # Inventory Features
        # ==============================

        dataset["total_stock"] = (
            dataset["available_quantity"]
            + dataset["reserved_quantity"]
            + dataset["damaged_quantity"]
        )

        dataset["inventory_value"] = (
            dataset["available_quantity"]
            * dataset["selling_price"]
        )

        dataset["reserved_ratio"] = (
            dataset["reserved_quantity"]
            / dataset["total_stock"]
        )

        dataset["damaged_ratio"] = (
            dataset["damaged_quantity"]
            / dataset["total_stock"]
        )

        dataset["available_ratio"] = (
            dataset["available_quantity"]
            / dataset["total_stock"]
        )

        # ==============================
        # Expiry Features
        # ==============================

        today = pd.Timestamp.today()

        dataset["days_to_expiry"] = (
            dataset["expiry_date"] - today
        ).dt.days

        dataset["expired"] = (
            dataset["days_to_expiry"] < 0
        ).astype(int)

        dataset["near_expiry"] = (
            dataset["days_to_expiry"] <= 30
        ).astype(int)

        # ==============================
        # Calendar Features
        # ==============================

        sale_date = pd.to_datetime(dataset["sale_date"], errors="coerce")
        dataset["day"] = sale_date.dt.day
        dataset["month"] = sale_date.dt.month
        dataset["weekday"] = sale_date.dt.weekday
        dataset["week_of_year"] = sale_date.dt.isocalendar().week.astype("float")
        dataset["is_weekend"] = (dataset["weekday"] >= 5).astype(int)

        # This price margin is available without knowing quantity sold.
        dataset["profit_per_unit"] = (
            dataset["selling_price_sale"]
            - dataset["mrp"]
        )

        # ==============================
        # Stock Health Features
        # ==============================

        dataset["usable_stock"] = (
            dataset["available_quantity"]
            - dataset["reserved_quantity"]
            - dataset["damaged_quantity"]
        )

        dataset["stock_difference"] = (
            dataset["available_quantity"]
            - dataset["minimum_stock"]
        )

        dataset["low_stock"] = (
            dataset["available_quantity"]
            <= dataset["minimum_stock"]
        ).astype(int)

        dataset["overstock"] = (
            dataset["available_quantity"]
            >= (dataset["minimum_stock"] * 3)
        ).astype(int)

        # Replace infinite values (if any)
        dataset.replace(
            [np.inf, -np.inf],
            0,
            inplace=True,
        )

        # Fill remaining missing values
        dataset.fillna(
            0,
            inplace=True,
        )

        return dataset
    
    def summary(self):
        """
        Display feature engineering summary.
        """

        dataset = self.engineer()

        print("=" * 60)
        print("ShelfSense AI Feature Engineered Dataset")
        print("=" * 60)

        print(f"Rows            : {dataset.shape[0]}")
        print(f"Columns         : {dataset.shape[1]}")

        print("\nColumn Names")
        print("-" * 60)

        for column in dataset.columns:
            print(column)

        print("\nMissing Values")
        print("-" * 60)

        print(dataset.isnull().sum())

        print("\nMemory Usage")
        print("-" * 60)

        memory = (
            dataset.memory_usage(deep=True).sum()
            / 1024
            / 1024
        )

        print(f"{memory:.2f} MB")

        print("=" * 60)

        return dataset

    def get_dataset(self):
        """
        Return the engineered dataset.
        """

        return self.engineer()

    @classmethod
    def engineer_all(cls, dataset):
        """Engineer features for the AnalyticsEngine orchestration path."""
        return cls(dataset=dataset).engineer()
