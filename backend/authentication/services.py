import secrets
from datetime import timedelta
from smtplib import SMTPException

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import send_mail
from django.utils import timezone
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PasswordResetCode, User
from .serializers import UserSerializer

# One-time code policy. Six digits is what people expect from an SMS or email
# code; everything else here exists to make six digits safe to accept.
OTP_TTL_MINUTES = 10
OTP_MAX_ATTEMPTS = 5


class InvalidResetCode(Exception):
    """Raised when a submitted code is wrong, expired, spent or exhausted."""


def create_token_response(user):
    refresh_token = RefreshToken.for_user(user)
    return {
        "access": str(refresh_token.access_token),
        "refresh": str(refresh_token),
        "user": UserSerializer(user).data,
    }


def blacklist_refresh_token(refresh_token):
    RefreshToken(refresh_token).blacklist()


def refresh_access_token(refresh_token):
    """Issue a new access token, rotating the refresh token as configured.

    SIMPLE_JWT sets ROTATE_REFRESH_TOKENS and BLACKLIST_AFTER_ROTATION, so the
    caller is handed a fresh refresh token and the old one is retired.

    A refresh token outlives an access token by days, so the account is checked
    here as well: without this, somebody deactivated a minute ago could keep
    minting access tokens for the rest of the week.
    """
    token = RefreshToken(refresh_token)

    user_id = token.payload.get(api_settings.USER_ID_CLAIM)
    account = User.objects.filter(pk=user_id).first()
    if account is None or not account.is_active:
        raise TokenError("This account is no longer active.")

    access_token = str(token.access_token)

    # Retire the presented refresh token, then re-stamp this one with a new id,
    # issued-at and expiry so the caller gets a usable replacement.
    token.blacklist()
    token.set_jti()
    token.set_exp()
    token.set_iat()

    return {"access": access_token, "refresh": str(token)}


def smtp_is_configured():
    """True when real mail is being sent rather than printed to the console."""
    return settings.EMAIL_BACKEND.endswith("smtp.EmailBackend")


def create_password_reset_code(user):
    """Issue a fresh six-digit code and return it in plain text.

    The plain code is returned once, to be emailed, and never stored. Any code
    this account was sent earlier is retired first, so an old email cannot be
    used after a new one is requested.
    """
    PasswordResetCode.objects.filter(user=user, used_at__isnull=True).update(
        used_at=timezone.now()
    )

    # secrets, not random: this value guards an account, so it must not come
    # from a predictable generator. Range keeps it exactly six digits.
    code = str(secrets.randbelow(900_000) + 100_000)

    PasswordResetCode.objects.create(
        user=user,
        code_hash=make_password(code),
        expires_at=timezone.now() + timedelta(minutes=OTP_TTL_MINUTES),
    )
    return code


def verify_password_reset_code(user, code, consume=False):
    """Check a submitted code, optionally spending it.

    Raises InvalidResetCode with a message safe to show the user. `consume`
    is True only on the final step, so checking the code and using it are the
    same decision made twice on the same row rather than two different rules.
    """
    record = (
        PasswordResetCode.objects.filter(user=user, used_at__isnull=True)
        .order_by("-created_at")
        .first()
    )
    if record is None:
        raise InvalidResetCode(
            "No active code for this account. Request a new one."
        )
    if record.is_expired:
        raise InvalidResetCode(
            f"That code expired. Codes last {OTP_TTL_MINUTES} minutes — request a new one."
        )
    if record.attempts >= OTP_MAX_ATTEMPTS:
        raise InvalidResetCode(
            "Too many incorrect attempts. Request a new code."
        )

    if not check_password(code, record.code_hash):
        # Count the wrong guess, and say how many remain so the limit is not a
        # surprise when it arrives.
        record.attempts += 1
        record.save(update_fields=["attempts"])
        remaining = OTP_MAX_ATTEMPTS - record.attempts
        if remaining <= 0:
            raise InvalidResetCode(
                "That code is incorrect, and this code is now blocked. Request a new one."
            )
        raise InvalidResetCode(
            f"That code is incorrect. {remaining} attempt(s) left."
        )

    if consume:
        record.used_at = timezone.now()
        record.save(update_fields=["used_at"])

    return record


def send_password_reset_email(user, code):
    """Email the one-time code. Returns True when the message was accepted.

    No link is sent — the code is typed back into the screen that asked for it,
    so an intercepted email alone cannot complete a reset on another device.

    Delivery failure must not break the request: the endpoint always answers
    the same way so it cannot be used to probe which emails are registered.
    """
    body = (
        f"Hello {user.full_name},\n\n"
        "Use this code to reset your ShelfSense AI password:\n\n"
        f"    {code}\n\n"
        f"The code is valid for {OTP_TTL_MINUTES} minutes and can be used once.\n"
        "Enter it on the screen where you requested it.\n\n"
        "If you did not request this, you can ignore this email — nothing has "
        "changed on your account.\n\n"
        "— ShelfSense AI"
    )

    try:
        sent = send_mail(
            subject=f"{code} is your ShelfSense AI password reset code",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except (OSError, SMTPException):
        return False
    return bool(sent)
