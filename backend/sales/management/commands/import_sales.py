"""
Import Sales CSV into Django database.

Usage:

python manage.py import_sales
"""

import csv
from pathlib import Path

from django.core.management.base import BaseCommand

from products.models import Product
from sales.models import Sales


class Command(BaseCommand):
    help = "Import Sales CSV"

    def handle(self, *args, **kwargs):

        csv_file = (
            Path(__file__)
            .resolve()
            .parents[4]
            / "dataset_generator"
            / "output"
            / "sales.csv"
        )

        if not csv_file.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"CSV not found: {csv_file}"
                )
            )
            return

        Sales.objects.all().delete()

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

                Sales.objects.create(

                    id=int(row["id"]),

                    product=product,

                    invoice_number=row["invoice_number"],

                    sale_date=row["sale_date"],

                    quantity_sold=int(
                        row["quantity_sold"]
                    ),

                    selling_price=row["selling_price"],

                    discount=row["discount"],

                    total_amount=row["total_amount"],

                )

                count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {count} sales records."
            )
        )