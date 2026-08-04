"""
Category CSV Generator
"""


from utils import save_csv
from master_data.all_products import ALL_PRODUCTS


def generate_category_csv():

    categories = sorted(
        set(product["category"] for product in ALL_PRODUCTS)
    )

    headers = [
        "id",
        "business_id",
        "category_name",
        "description",
    ]

    rows = []

    for category_id, category in enumerate(categories, start=1):

        rows.append([
            category_id,
            1,
            category,
            f"{category} Products",
        ])

    save_csv(
        filename="categories.csv",
        headers=headers,
        rows=rows,
    )