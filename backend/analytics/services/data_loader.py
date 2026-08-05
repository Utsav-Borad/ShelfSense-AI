"""
data_loader.py

Converts Django QuerySets into Pandas DataFrames.

This module acts as a bridge between
Django ORM and the Analytics Engine.
"""

import pandas as pd

from analytics.services.repository import (
    get_products,
    get_inventory,
    get_sales,
    get_suppliers,
    get_categories,
    get_businesses,
)


def load_products():
    """
    Load products from the database.
    """

    from products.models import Product

    queryset = Product.objects.values(
        "id",
        "business_id",
        "category_id",
        "supplier_id",
        "barcode",
        "product_name",
        "brand",
        "unit",
        "mrp",
        "selling_price",
        "manufacturing_date",
        "expiry_date",
        "minimum_stock",
        "status",
    )

    return pd.DataFrame(queryset)

def load_inventory():
    """
    Load inventory from the database.
    """

    from inventory.models import Inventory

    queryset = Inventory.objects.values(
        "id",
        "product_id",
        "available_quantity",
        "reserved_quantity",
        "damaged_quantity",
        "last_updated",
    )

    return pd.DataFrame(queryset)

def load_sales():
    """
    Load sales from the database.
    """

    from sales.models import Sales

    queryset = Sales.objects.values(
        "id",
        "product_id",
        "invoice_number",
        "sale_date",
        "quantity_sold",
        "selling_price",
        "discount",
        "total_amount",
    )

    return pd.DataFrame(queryset)


def load_suppliers():
    """
    Load suppliers from the database.
    """

    from suppliers.models import Supplier

    queryset = Supplier.objects.values(
        "id",
        "business_id",
        "supplier_name",
        "phone",
        "email",
        "address",
        "status",
    )

    return pd.DataFrame(queryset)


def load_categories():
    """
    Load categories from the database.
    """

    from categories.models import Category

    queryset = Category.objects.values(
        "id",
        "business_id",
        "category_name",
        "description",
    )

    return pd.DataFrame(queryset)

def load_businesses():
    """
    Load businesses into a Pandas DataFrame.
    """
    queryset = get_businesses()

    return pd.DataFrame(
        list(
            queryset.values(
                "id",
                "shop_name",
                "shop_type",
                "gst_number",
            )
        )
    )


def load_all_data():
    """
    Load all datasets required for Analytics.
    """

    return {
        "products": load_products(),
        "inventory": load_inventory(),
        "sales": load_sales(),
        "suppliers": load_suppliers(),
        "categories": load_categories(),
        "businesses": load_businesses(),
    }