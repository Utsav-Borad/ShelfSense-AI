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
    
    def __init__(self):

        preprocessor = DataPreprocessor()

        self.dataset = preprocessor.get_dataset()
        
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
        # Sales & Profit Features
        # ==============================

        dataset["revenue"] = (
            dataset["quantity_sold"]
            * dataset["selling_price_sale"]
        )

        dataset["profit_per_unit"] = (
            dataset["selling_price_sale"]
            - dataset["mrp"]
        )

        dataset["profit"] = (
            dataset["profit_per_unit"]
            * dataset["quantity_sold"]
        )

        dataset["discount_percentage"] = (
            dataset["discount"]
            / (
                dataset["selling_price_sale"]
                * dataset["quantity_sold"]
            )
        ) * 100

        dataset["average_sale_value"] = (
            dataset["total_amount"]
            / dataset["quantity_sold"]
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

        dataset["dead_stock_candidate"] = (
            (
                dataset["available_quantity"]
                > dataset["minimum_stock"]
            )
            &
            (
                dataset["quantity_sold"] <= 2
            )
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