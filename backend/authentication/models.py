from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from .managers import UserManager


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
    
    objects = UserManager()

    def __str__(self):
        return self.email


class PasswordResetCode(models.Model):
    """A one-time code emailed to somebody resetting their password.

    The code itself is never stored — only a hash of it, the same way a
    password is. A leaked database therefore cannot be used to reset accounts.

    A row is spent (`used_at` set) the moment a password is changed with it, and
    requesting a new code retires every earlier one, so only the newest code an
    account was sent can ever work.
    """

    user = models.ForeignKey(
        "authentication.User",
        on_delete=models.CASCADE,
        related_name="password_reset_codes",
    )
    code_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    # Counts wrong guesses. Past the limit the code is dead, so a six-digit
    # code cannot be found by trying every combination.
    attempts = models.PositiveSmallIntegerField(default=0)
    used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "-created_at"])]

    def __str__(self):
        return f"Reset code for {self.user.email}"

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    @property
    def is_spent(self):
        return self.used_at is not None
