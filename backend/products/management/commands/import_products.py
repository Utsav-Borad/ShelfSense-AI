"""
Import Products CSV into Django database.

Usage:

python manage.py import_products
"""

import csv
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from business.models import Business
from categories.models import Category
from suppliers.models import Supplier
from products.models import Product


class Command(BaseCommand):
    help = "Import Products CSV"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            dest="file",
            help="Path to the CSV file. Defaults to dataset_generator/output/products.csv.",
        )

    @transaction.atomic
    def handle(self, *args, **kwargs):

        default_csv_file = (
            Path(__file__)
            .resolve()
            .parents[4]
            / "dataset_generator"
            / "output"
            / "products.csv"
        )
        csv_file = (
            Path(kwargs["file"]) if kwargs.get("file") else default_csv_file
        )

        if not csv_file.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"CSV not found: {csv_file}"
                )
            )
            return

        # Matched on id and updated in place — clearing the table would cascade
        # into inventory and sales.
        with open(
            csv_file,
            newline="",
            encoding="utf-8",
        ) as file:

            reader = csv.DictReader(file)

            count = 0

            for row in reader:

                business = Business.objects.get(
                    id=int(row["business_id"])
                )

                category = Category.objects.get(
                    id=int(row["category_id"])
                )

                supplier = Supplier.objects.get(
                    id=int(row["supplier_id"])
                )

                Product.objects.update_or_create(

                    id=int(row["id"]),

                    defaults={

                        "business": business,

                        "category": category,

                        "supplier": supplier,

                        "barcode": row["barcode"],

                        "product_name": row["product_name"],

                        "brand": row["brand"],

                        "unit": row["unit"],

                        "mrp": row["mrp"],

                        "selling_price": row["selling_price"],

                        "manufacturing_date": row["manufacturing_date"],

                        "expiry_date": row["expiry_date"],

                        "minimum_stock": int(row["minimum_stock"]),

                        "status": row["status"],

                    },

                )

                count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {count} products."
            )
        )