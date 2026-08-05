"""
dataset_builder.py

Builds the master Machine Learning dataset
from ShelfSense AI database.
"""

import pandas as pd

from analytics.services.data_loader import (
    load_businesses,
    load_categories,
    load_suppliers,
    load_products,
    load_inventory,
    load_sales,
)


class DatasetBuilder:
    """
    Builds one master dataset for all
    Machine Learning models.
    """

    def __init__(self, data=None):
        """Create a builder from loaded data or the Django data source.

        ``data`` keeps the orchestration layer from loading the same database
        tables twice while preserving the existing no-argument behaviour.
        """
        if data is None:
            data = {
                "businesses": load_businesses(),
                "categories": load_categories(),
                "suppliers": load_suppliers(),
                "products": load_products(),
                "inventory": load_inventory(),
                "sales": load_sales(),
            }

        self.businesses = data["businesses"]
        self.categories = data["categories"]
        self.suppliers = data["suppliers"]
        self.products = data["products"]
        self.inventory = data["inventory"]
        self.sales = data["sales"]
    def build(self):
        """
        Build one master dataset for
        Machine Learning.
        """

        # Merge Products + Inventory
        dataset = self.products.merge(
            self.inventory,
            left_on="id",
            right_on="product_id",
            how="left",
        )

        # Merge Categories
        dataset = dataset.merge(
            self.categories,
            left_on="category_id",
            right_on="id",
            how="left",
            suffixes=("", "_category"),
        )

        # Merge Suppliers
        dataset = dataset.merge(
            self.suppliers,
            left_on="supplier_id",
            right_on="id",
            how="left",
            suffixes=("", "_supplier"),
        )

        # Merge Businesses
        dataset = dataset.merge(
            self.businesses,
            left_on="business_id",
            right_on="id",
            how="left",
            suffixes=("", "_business"),
        )

        # Merge Sales
        dataset = dataset.merge(
            self.sales,
            left_on="id",
            right_on="product_id",
            how="left",
            suffixes=("", "_sale"),
        )

        dataset.reset_index(
            drop=True,
            inplace=True,
        )

        return dataset

    def summary(self):
        """
        Display dataset summary.
        """

        dataset = self.build()

        print("=" * 60)
        print("ShelfSense AI Machine Learning Dataset")
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

        print("\nData Types")
        print("-" * 60)

        print(dataset.dtypes)

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
