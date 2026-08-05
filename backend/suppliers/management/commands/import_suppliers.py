"""
Import Suppliers CSV into Django database.

Usage:

python manage.py import_suppliers
"""

import csv
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from business.models import Business
from suppliers.models import Supplier


class Command(BaseCommand):
    help = "Import Suppliers CSV"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            dest="file",
            help="Path to the CSV file. Defaults to dataset_generator/output/suppliers.csv.",
        )

    @transaction.atomic
    def handle(self, *args, **kwargs):

        default_csv_file = (
            Path(__file__)
            .resolve()
            .parents[4]
            / "dataset_generator"
            / "output"
            / "suppliers.csv"
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
        # into products, inventory and sales.
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

                Supplier.objects.update_or_create(
                    id=int(row["id"]),
                    defaults={
                        "business": business,
                        "supplier_name": row["supplier_name"],
                        "phone": row["phone"],
                        "email": row["email"],
                        "address": row["address"],
                        "status": row["status"],
                    },
                )

                count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {count} suppliers."
            )
        )