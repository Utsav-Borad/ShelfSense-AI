"""
Import Inventory CSV into Django database.

Usage:

python manage.py import_inventory
"""

import csv
from pathlib import Path

from django.core.management.base import BaseCommand

from products.models import Product
from inventory.models import Inventory


class Command(BaseCommand):
    help = "Import Inventory CSV"

    def handle(self, *args, **kwargs):

        csv_file = (
            Path(__file__)
            .resolve()
            .parents[4]
            / "dataset_generator"
            / "output"
            / "inventory.csv"
        )

        if not csv_file.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"CSV not found: {csv_file}"
                )
            )
            return

        Inventory.objects.all().delete()

        with open(
            csv_file,
            newline="",
            encoding="utf-8",
        ) as file:

            reader = csv.DictReader(file)

            count = 0

            for row in reader:

                product = Product.objects.get(
                    id=int(row["product_id"])
                )

                Inventory.objects.create(

                    id=int(row["id"]),

                    product=product,

                    available_quantity=int(
                        row["available_quantity"]
                    ),

                    reserved_quantity=int(
                        row["reserved_quantity"]
                    ),

                    damaged_quantity=int(
                        row["damaged_quantity"]
                    ),

                )

                count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {count} inventory records."
            )
        )