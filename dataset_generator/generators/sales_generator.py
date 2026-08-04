"""
Sales CSV Generator
Generates realistic supermarket sales history.
"""

import random
from datetime import date, timedelta

from master_data.all_products import ALL_PRODUCTS
from utils import save_csv


START_DATE = date(2025, 1, 1)
TOTAL_DAYS = 365

def generate_invoice(invoice_number):
    """
    Generates invoice number.
    """

    return f"INV-{invoice_number:06d}"

def calculate_quantity(product, current_date):
    """
    Calculates realistic quantity sold.
    """

    quantity = product["base_daily_sales"]

    # Random daily variation
    quantity *= random.uniform(0.85, 1.15)

    # Weekend
    if current_date.weekday() >= 5:
        quantity *= product["weekend_multiplier"]

    # Summer (March-May)
    if current_date.month in [3, 4, 5]:
        quantity *= product["summer_multiplier"]

    # Winter (November-January)
    if current_date.month in [11, 12, 1]:
        quantity *= product["winter_multiplier"]

    # Festival Season (October-November)
    if current_date.month in [10, 11]:
        quantity *= product["festival_multiplier"]

    # Salary Week (1st-7th)
    if current_date.day <= 7:
        quantity *= product["salary_week_multiplier"]

    return max(0, round(quantity))

def generate_sales_csv():

    headers = [
        "id",
        "product_id",
        "invoice_number",
        "sale_date",
        "quantity_sold",
        "selling_price",
        "discount",
        "total_amount",
    ]

    rows = []

    sale_id = 1

    for day in range(TOTAL_DAYS):

        current_date = START_DATE + timedelta(days=day)

        for product_id, product in enumerate(ALL_PRODUCTS, start=1):

            quantity = calculate_quantity(product, current_date)

            # Random weather impact
            weather = random.choice(["normal", "hot", "cold"])

            if weather == "hot":
                if product["category"] in ["Beverages", "Frozen Food"]:
                    quantity = int(quantity * 1.20)

            if weather == "cold":
                if product["category"] == "Medicine":
                    quantity = int(quantity * 1.15)

            # Low-demand products may not sell every day
            if quantity <= 2 and random.random() < 0.40:
                continue
            available_stock = random.randint(
            product["minimum_stock"],
            product["minimum_stock"] + product["reorder_quantity"] * 2,)

            quantity = min(quantity, available_stock)

            if quantity <= 0:
                continue

            selling_price = round(product["selling"] * random.uniform(0.98, 1.02),2,)

            if random.random() < 0.25:
                discount = random.choice([5, 10, 15, 20])
            else:
                discount = 0

            discounted_price = selling_price * (1 - discount / 100)
            total_amount = round(quantity * discounted_price, 2)

            rows.append([
                sale_id,
                product_id,
                generate_invoice((sale_id // random.randint(2, 5)) + 1),
                current_date,
                quantity,
                selling_price,
                discount,
                total_amount,
            ])

            sale_id += 1

    save_csv(
        filename="sales.csv",
        headers=headers,
        rows=rows,
    )
    
