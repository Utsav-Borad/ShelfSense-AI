"""
Import Business CSV into Django database.

Usage:

python manage.py import_business
"""

import csv
from pathlib import Path

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

from business.models import Business


class Command(BaseCommand):
    help = "Import Business CSV"

    def handle(self, *args, **kwargs):

        csv_file = (
            Path(__file__)
            .resolve()
            .parents[4]
            / "dataset_generator"
            / "output"
            / "business.csv"
        )

        if not csv_file.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"CSV not found: {csv_file}"
                )
            )
            return

        Business.objects.all().delete()

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

                Business.objects.create(
                    id=int(row["id"]),
                    owner=owner,
                    shop_name=row["shop_name"],
                    shop_type=row["shop_type"],
                    address=row["address"],
                    phone=row["phone"],
                    gst_number=row["gst_number"],
                )   

                count += 1



        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {count} businesses."
            )
        )