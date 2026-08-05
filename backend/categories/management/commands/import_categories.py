"""
Import Categories CSV into Django database.

Usage:

python manage.py import_categories
"""

import csv
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from business.models import Business
from categories.models import Category


class Command(BaseCommand):
    help = "Import Categories CSV"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            dest="file",
            help="Path to the CSV file. Defaults to dataset_generator/output/categories.csv.",
        )

    @transaction.atomic
    def handle(self, *args, **kwargs):

        default_csv_file = (
            Path(__file__)
            .resolve()
            .parents[4]
            / "dataset_generator"
            / "output"
            / "categories.csv"
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

        # Rows are matched on id and updated in place. Deleting every category
        # first would cascade into products, and from there into inventory and
        # sales, so a re-import must never start by clearing the table.
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

                Category.objects.update_or_create(
                    id=int(row["id"]),
                    defaults={
                        "business": business,
                        "category_name": row["category_name"],
                        "description": row["description"],
                    },
                )

                count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {count} categories."
            )
        )