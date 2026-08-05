"""
Import Suppliers CSV into Django database.

Usage:

python manage.py import_suppliers
"""

import csv
from pathlib import Path

from django.core.management.base import BaseCommand

from business.models import Business
from suppliers.models import Supplier


class Command(BaseCommand):
    help = "Import Suppliers CSV"

    def handle(self, *args, **kwargs):

        csv_file = (
            Path(__file__)
            .resolve()
            .parents[4]
            / "dataset_generator"
            / "output"
            / "suppliers.csv"
        )

        if not csv_file.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"CSV not found: {csv_file}"
                )
            )
            return

        Supplier.objects.all().delete()

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

                Supplier.objects.create(
                    id=int(row["id"]),
                    business=business,
                    supplier_name=row["supplier_name"],
                    phone=row["phone"],
                    email=row["email"],
                    address=row["address"],
                    status=row["status"],
                )

                count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {count} suppliers."
            )
        )