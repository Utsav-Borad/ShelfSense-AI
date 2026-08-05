"""
Import Business CSV into Django database.

Usage:

python manage.py import_business
"""

import csv
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model

from business.models import Business


class Command(BaseCommand):
    help = "Import Business CSV"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            dest="file",
            help="Path to the CSV file. Defaults to dataset_generator/output/business.csv.",
        )

    @transaction.atomic
    def handle(self, *args, **kwargs):

        default_csv_file = (
            Path(__file__)
            .resolve()
            .parents[4]
            / "dataset_generator"
            / "output"
            / "business.csv"
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
        # into categories, suppliers, products, inventory and sales.
        with open(
            csv_file,
            newline="",
            encoding="utf-8",
        ) as file:

            reader = csv.DictReader(file)

            count = 0
            
            User = get_user_model()

            for row in reader:

                owner = User.objects.get(
                    id=int(row["owner_id"])
                )

                Business.objects.update_or_create(
                    id=int(row["id"]),
                    defaults={
                        "owner": owner,
                        "shop_name": row["shop_name"],
                        "shop_type": row["shop_type"],
                        "address": row["address"],
                        "phone": row["phone"],
                        "gst_number": row["gst_number"],
                    },
                )

                count += 1



        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {count} businesses."
            )
        )