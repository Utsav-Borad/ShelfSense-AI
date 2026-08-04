"""
Business CSV Generator
"""

from utils import save_csv


def generate_business_csv():

    headers = [
        "id",
        "owner_id",
        "shop_name",
        "shop_type",
        "address",
        "phone",
        "gst_number",
        "created_at",
    ]

    rows = [

        [
            1,
            1,
            "Shree Krishna Supermart",
            "Supermarket",
            "Satellite, Ahmedabad, Gujarat",
            "9876543210",
            "24ABCDE1234F1Z5",
            "2025-01-01 09:00:00",
        ]

    ]

    save_csv(
        filename="business.csv",
        headers=headers,
        rows=rows,
    )