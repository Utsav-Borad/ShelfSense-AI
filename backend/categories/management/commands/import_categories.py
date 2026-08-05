"""
Import Categories CSV into Django database.

Usage:

python manage.py import_categories
"""

import csv
from pathlib import Path

from django.core.management.base import BaseCommand

from business.models import Business
from categories.models import Category


class Command(BaseCommand):
    help = "Import Categories CSV"

    def handle(self, *args, **kwargs):

        csv_file = (
            Path(__file__)
            .resolve()
            .parents[4]
            / "dataset_generator"
            / "output"
            / "categories.csv"
        )

        if not csv_file.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"CSV not found: {csv_file}"
                )
            )
            return

        Category.objects.all().delete()

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

                Category.objects.create(
                    id=int(row["id"]),
                    business=business,
                    category_name=row["category_name"],
                    description=row["description"],
                )

                count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {count} categories."
            )
        )