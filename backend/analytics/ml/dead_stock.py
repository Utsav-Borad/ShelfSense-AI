"""
Dead Stock Detection Module
"""

from datetime import timedelta

import pandas as pd

from analytics.services.data_loader import load_sales_data
from analytics.services.data_loader import load_products_data

def detect_dead_stock():

    """
    Detects products that have stopped selling.
    """
    
    sales_df = load_sales_data()

    products_df = load_products_data()
        
    if sales_df.empty:
        return []
    
    sales_df["sale_date"] = pd.to_datetime(
        sales_df["sale_date"]
    )
    
    latest_sale = sales_df["sale_date"].max()

    last_sales = (
        sales_df
        .groupby("product_id")["sale_date"]
        .max()
        .reset_index()
    )

    products = products_df.merge(
        last_sales,
        on="product_id",
        how="left",
    )

    products["days_since_last_sale"] = (
        latest_sale - products["sale_date"]
    ).dt.days

def classify(days):

    if pd.isna(days):
        return "Dead Stock"

    if days >= 60:
        return "Dead Stock"

    if days >= 30:
        return "Slow Moving"

    return "Healthy"
