from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """An authenticated ShelfSense AI platform account."""

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        USER = "user", "User"

    username = None
    full_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.email
