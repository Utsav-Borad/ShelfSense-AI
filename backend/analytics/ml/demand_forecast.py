"""
demand_forecast.py

Predicts future product demand based on
historical sales.
"""

import pandas as pd

from analytics.services.data_loader import (
    load_products,
    load_sales,
)


def forecast_demand():
    """
    Forecast future demand.

    Returns:
        Pandas DataFrame
    """

    products_df = load_products()
    sales_df = load_sales()

    if products_df.empty or sales_df.empty:
        return pd.DataFrame()

    # Convert date column
    sales_df["sale_date"] = pd.to_datetime(
        sales_df["sale_date"]
    )

    # Total quantity sold
    total_sales = (
        sales_df.groupby("product__product_name")[
            "quantity_sold"
        ]
        .sum()
        .reset_index()
    )

    # Number of selling days
    selling_days = (
        sales_df.groupby("product__product_name")[
            "sale_date"
        ]
        .nunique()
        .reset_index()
    )

    selling_days.rename(
        columns={"sale_date": "selling_days"},
        inplace=True,
    )

    # Merge data
    forecast = products_df.merge(
        total_sales,
        left_on="product_name",
        right_on="product__product_name",
        how="left",
    )

    forecast = forecast.merge(
        selling_days,
        left_on="product_name",
        right_on="product__product_name",
        how="left",
    )

    # Fill missing values
    forecast["quantity_sold"] = forecast[
        "quantity_sold"
    ].fillna(0)

    forecast["selling_days"] = forecast[
        "selling_days"
    ].fillna(1)

    # Average daily sales
    forecast["average_daily_sales"] = round(
        forecast["quantity_sold"]
        / forecast["selling_days"],
        2,
    )

    # Next 30-day demand
    forecast["predicted_next_30_days"] = round(
        forecast["average_daily_sales"] * 30
    )

    def demand_level(value):

        if value >= 300:
            return "High"

        if value >= 100:
            return "Medium"

        return "Low"

    forecast["demand_level"] = forecast[
        "predicted_next_30_days"
    ].apply(demand_level)

    def recommendation(level):

        if level == "High":
            return "Increase stock."

        if level == "Medium":
            return "Maintain stock."

        return "Reduce inventory."

    forecast["recommendation"] = forecast[
        "demand_level"
    ].apply(recommendation)

    return forecast[
        [
            "id",
            "product_name",
            "average_daily_sales",
            "predicted_next_30_days",
            "demand_level",
            "recommendation",
        ]
    ]