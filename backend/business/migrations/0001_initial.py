from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Business",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("shop_name", models.CharField(max_length=255)),
                ("shop_type", models.CharField(max_length=100)),
                ("address", models.TextField()),
                ("phone", models.CharField(max_length=20)),
                ("gst_number", models.CharField(blank=True, max_length=15, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "owner",
                    models.OneToOneField(
                        on_delete=models.deletion.CASCADE,
                        related_name="business",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]