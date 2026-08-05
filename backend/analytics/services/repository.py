"""
repository.py

This module is responsible for reading data from the Django database.

It acts as the single access point between the Analytics module
and Kansara's backend models.

Responsibilities:
- Fetch Products
- Fetch Inventory
- Fetch Sales
- Fetch Suppliers
- Fetch Categories
- Fetch Business data

This module NEVER performs:
- Machine Learning
- Data Cleaning
- Feature Engineering
- Business Recommendations

It only reads data.
"""

from products.models import Product
from inventory.models import Inventory
from sales.models import Sales
from suppliers.models import Supplier
from categories.models import Category
from business.models import Business


def get_products():
    """
    Fetch all products from the database.

    Returns:
        QuerySet: Django QuerySet containing all Product records.
    """
    return Product.objects.select_related(
        "business",
        "category",
        "supplier"
    ).all()
    
def get_inventory():
    """
    Fetch all inventory records.
    """
    return Inventory.objects.select_related(
        "product"
    ).all()


def get_sales():
    """
    Fetch all sales records.
    """
    return Sales.objects.select_related(
        "product"
    ).all()


def get_latest_sale_values():
    """Fetch only the sales columns the AI pipeline reads, as plain dicts.

    ``get_sales()`` builds a full Sales model instance per row, which costs most
    of a second across a year of sales. The pipeline needs four columns and the
    newest row per product, so this returns lightweight dictionaries instead.
    Ordering oldest first means a simple overwrite leaves the newest row.
    """
    latest = {}
    rows = Sales.objects.values(
        "product_id",
        "sale_date",
        "selling_price",
        "discount",
    ).order_by("sale_date")

    for row in rows:
        latest[row["product_id"]] = row
    return latest


def get_suppliers():
    """
    Fetch all suppliers.
    """
    return Supplier.objects.all()


def get_categories():
    """
    Fetch all categories.
    """
    return Category.objects.select_related(
        "business"
    ).all()


def get_businesses():
    """
    Fetch all businesses.
    """
    return Business.objects.select_related(
        "owner"
    ).all()