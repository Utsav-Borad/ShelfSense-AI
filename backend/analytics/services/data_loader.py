"""
dead_stock.py

Detects dead stock and slow-moving products
using historical sales data.
"""

import pandas as pd

from analytics.services.data_loader import (
    load_products,
    load_sales,
)


def detect_dead_stock():
    """
    Analyze product sales and classify stock status.

    Returns:
        Pandas DataFrame
    """

    products_df = load_products()
    sales_df = load_sales()

    if products_df.empty or sales_df.empty:
        return pd.DataFrame()

    # Convert sale_date into datetime
    sales_df["sale_date"] = pd.to_datetime(sales_df["sale_date"])

    # Latest sale date in the dataset
    latest_date = sales_df["sale_date"].max()

    # Last sale date for each product
    last_sales = (
        sales_df.groupby("product__product_name")["sale_date"]
        .max()
        .reset_index()
    )

    # Merge with product list
    result = products_df.merge(
        last_sales,
        left_on="product_name",
        right_on="product__product_name",
        how="left",
    )

    # Calculate days since last sale
    result["days_since_last_sale"] = (
        latest_date - result["sale_date"]
    ).dt.days

    def classify(days):
        if pd.isna(days):
            return "Dead Stock"

        if days >= 60:
            return "Dead Stock"

        if days >= 30:
            return "Slow Moving"

        return "Healthy"

    result["stock_status"] = result[
        "days_since_last_sale"
    ].apply(classify)

    def recommendation(status):
        if status == "Dead Stock":
            return "Apply heavy discount or remove product."

        if status == "Slow Moving":
            return "Run promotional offers."

        return "Maintain current inventory."

    result["recommendation"] = result[
        "stock_status"
    ].apply(recommendation)

    return result[
        [
            "id",
            "product_name",
            "category__category_name",
            "supplier__supplier_name",
            "days_since_last_sale",
            "stock_status",
            "recommendation",
        ]
    ]