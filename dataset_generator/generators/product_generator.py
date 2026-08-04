"""
Product CSV Generator
"""
from master_data.all_products import ALL_PRODUCTS
from utils import save_csv



def generate_product_csv():

    categories = sorted(set(p["category"] for p in ALL_PRODUCTS))
    category_map = {
        category: index + 1
        for index, category in enumerate(categories)
    }

    brands = sorted(set(p["brand"] for p in ALL_PRODUCTS))
    supplier_map = {
        brand: index + 1
        for index, brand in enumerate(brands)
    }

    headers = [
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
    ]

    rows = []

    for product_id, product in enumerate(ALL_PRODUCTS, start=1):

        barcode = f"890{100000000 + product_id}"

        rows.append([
            product_id,
            1,
            category_map[product["category"]],
            supplier_map[product["brand"]],
            barcode,
            product["name"],
            product["brand"],
            product["unit"],
            product["mrp"],
            product["selling"],
            "2025-01-01",
            "2026-12-31",
            product["minimum_stock"],
            "ACTIVE",
        ])

    save_csv(
        filename="products.csv",
        headers=headers,
        rows=rows,
    )