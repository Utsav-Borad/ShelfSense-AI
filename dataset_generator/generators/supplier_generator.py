"""
Supplier CSV Generator
"""

from utils import save_csv
from master_data.all_products import ALL_PRODUCTS

def generate_supplier_csv():

    brands = sorted(
        set(product["brand"] for product in ALL_PRODUCTS)
    )

    headers = [
        "id",
        "business_id",
        "supplier_name",
        "phone",
        "email",
        "address",
        "status",
    ]

    rows = []

    for supplier_id, brand in enumerate(brands, start=1):

        rows.append([
            supplier_id,
            1,
            f"{brand} Distributor",
            f"98{supplier_id:08d}",
            f"{brand.lower().replace(' ', '')}@supplier.com",
            "Ahmedabad, Gujarat",
            "ACTIVE",
        ])

    save_csv(
        filename="suppliers.csv",
        headers=headers,
        rows=rows,
    )