from smtplib import SMTPException

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer


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
    """
    token = RefreshToken(refresh_token)
    access_token = str(token.access_token)

    # Retire the presented refresh token, then re-stamp this one with a new id,
    # issued-at and expiry so the caller gets a usable replacement.
    token.blacklist()
    token.set_jti()
    token.set_exp()
    token.set_iat()

    return {"access": access_token, "refresh": str(token)}


def build_password_reset_token(user):
    """Pack the user id and Django's reset token into one opaque string."""
    encoded_id = urlsafe_base64_encode(force_bytes(user.pk))
    return f"{encoded_id}.{default_token_generator.make_token(user)}"


def smtp_is_configured():
    """True when real mail is being sent rather than printed to the console."""
    return settings.EMAIL_BACKEND.endswith("smtp.EmailBackend")


def send_password_reset_email(user, reset_token):
    """Email the reset link. Returns True when the message was accepted.

    Delivery failure must not break the request: the endpoint always answers
    the same way so it cannot be used to probe which emails are registered.
    """
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    body = (
        f"Hello {user.full_name},\n\n"
        "We received a request to reset your ShelfSense AI password.\n"
        f"Open this link to choose a new one:\n\n{reset_url}\n\n"
        "The link can be used once and stops working after your password "
        "changes. If you did not request this, you can ignore this email.\n\n"
        "— ShelfSense AI"
    )

    try:
        sent = send_mail(
            subject="Reset your ShelfSense AI password",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except (OSError, SMTPException):
        return False
    return bool(sent)
