"""
inventory_loss.py

Analyzes inventory loss using damaged stock
and available stock.
"""

import pandas as pd

from analytics.services.data_loader import load_inventory


def analyze_inventory_loss():
    """
    Analyze inventory loss.

    Returns:
        Pandas DataFrame
    """

    inventory_df = load_inventory()

    if inventory_df.empty:
        return pd.DataFrame()

    # Total stock
    inventory_df["total_stock"] = (
        inventory_df["available_quantity"]
        + inventory_df["damaged_quantity"]
    )

    # Prevent division by zero
    inventory_df["total_stock"] = inventory_df[
        "total_stock"
    ].replace(0, 1)

    # Loss percentage
    inventory_df["loss_percentage"] = round(
        (
            inventory_df["damaged_quantity"]
            / inventory_df["total_stock"]
        )
        * 100,
        2,
    )

    def classify(loss):

        if loss >= 20:
            return "Critical"

        if loss >= 10:
            return "High Loss"

        if loss >= 5:
            return "Moderate"

        return "Healthy"

    inventory_df["inventory_status"] = inventory_df[
        "loss_percentage"
    ].apply(classify)

    def recommendation(status):

        if status == "Critical":
            return "Immediate investigation required."

        if status == "High Loss":
            return "Check storage and handling."

        if status == "Moderate":
            return "Monitor inventory regularly."

        return "Inventory is healthy."

    inventory_df["recommendation"] = inventory_df[
        "inventory_status"
    ].apply(recommendation)

    return inventory_df[
        [
            "id",
            "product__product_name",
            "available_quantity",
            "damaged_quantity",
            "loss_percentage",
            "inventory_status",
            "recommendation",
        ]
    ]