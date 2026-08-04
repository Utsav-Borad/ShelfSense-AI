"""
Inventory CSV Generator
"""

import random
from master_data.all_products import ALL_PRODUCTS
from utils import save_csv



def generate_inventory_csv():

    headers = [
        "id",
        "product_id",
        "available_quantity",
        "reserved_quantity",
        "damaged_quantity",
        "last_updated",
    ]

    rows = []

    for product_id, product in enumerate(ALL_PRODUCTS, start=1):

        minimum = product["minimum_stock"]

        available = random.randint(
            minimum,
            minimum + product["reorder_quantity"]
        )

        reserved = random.randint(0, 10)

        damaged = random.randint(0, 5)

        rows.append([
            product_id,
            product_id,
            available,
            reserved,
            damaged,
            "2025-12-31 18:00:00",
        ])

    save_csv(
        filename="inventory.csv",
        headers=headers,
        rows=rows,
    )