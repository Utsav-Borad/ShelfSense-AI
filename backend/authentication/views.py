from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError

from .models import User
from .permissions import IsAdminRole
from .serializers import (
    LoginSerializer,
    LogoutSerializer,
    PasswordResetCodeSerializer,
    PasswordResetConfirmSerializer,
    ProfileUpdateSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    TokenRefreshSerializer,
    UserSerializer,
)
from .services import (
    InvalidResetCode,
    blacklist_refresh_token,
    create_password_reset_code,
    create_token_response,
    refresh_access_token,
    send_password_reset_email,
    smtp_is_configured,
    verify_password_reset_code,
)


class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        payload = {"status": True, "message": "Account created successfully.", "data": UserSerializer(user).data}
        return Response(payload, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payload = {"status": True, "message": "Login successful.", "data": create_token_response(serializer.validated_data["user"])}
        return Response(payload)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            blacklist_refresh_token(serializer.validated_data["refresh"])
        except TokenError:
            payload = {"status": False, "message": "Validation Error", "errors": {"refresh": ["Invalid or expired refresh token."]}}
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)
        return Response({"status": True, "message": "Logout successful.", "data": {}})


class TokenRefreshView(APIView):
    """Exchange a refresh token for a new access token.

    Access tokens live 30 minutes; without this the stored refresh token could
    never be spent and every session would simply expire.
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            tokens = refresh_access_token(serializer.validated_data["refresh"])
        except TokenError:
            payload = {
                "status": False,
                "message": "Validation Error",
                "errors": {"refresh": ["Invalid or expired refresh token."]},
            }
            return Response(payload, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"status": True, "message": "Token refreshed.", "data": tokens})


def _reset_code_error(error):
    """Turn a rejected code into the project's 400 shape."""
    return Response(
        {"status": False, "message": "Validation Error", "errors": {"code": [str(error)]}},
        status=status.HTTP_400_BAD_REQUEST,
    )


class PasswordResetRequestView(APIView):
    """Step 1 — email a one-time code.

    The response is deliberately identical whether or not the email exists, so
    the endpoint cannot be used to discover which addresses are registered.

    No link is sent. When SMTP credentials are not configured the mail is
    printed to the console instead, and the code is also returned in the
    response so the flow stays usable in development.
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = {}
        user = User.objects.filter(email=serializer.validated_data["email"]).first()
        if user is not None:
            code = create_password_reset_code(user)
            delivered = send_password_reset_email(user, code)
            # Hand the code back only when no real email went out, so a
            # production response never carries a usable credential.
            if not delivered or not smtp_is_configured():
                data["code"] = code

        payload = {
            "status": True,
            "message": "If that email exists, a code is on its way.",
            "data": data,
        }
        return Response(payload)


class PasswordResetVerifyView(APIView):
    """Step 2 — check the code without spending it.

    Lets the screen move on to the new-password fields only once the code is
    known to be good, rather than accepting a password and rejecting it after.
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = PasswordResetCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.filter(email=serializer.validated_data["email"]).first()
        if user is None:
            # Same wording a wrong code gets: no hint about which part is wrong.
            return _reset_code_error("That code is incorrect or has expired.")

        try:
            verify_password_reset_code(user, serializer.validated_data["code"])
        except InvalidResetCode as error:
            return _reset_code_error(error)

        return Response(
            {"status": True, "message": "Code verified.", "data": {"verified": True}}
        )


class PasswordResetConfirmView(APIView):
    """Step 3 — set the new password, spending the code."""

    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.filter(email=serializer.validated_data["email"]).first()
        if user is None:
            return _reset_code_error("That code is incorrect or has expired.")

        # Re-checked here rather than trusted from the verify step: that request
        # proves nothing about this one.
        try:
            verify_password_reset_code(
                user,
                serializer.validated_data["code"],
                consume=True,
            )
        except InvalidResetCode as error:
            return _reset_code_error(error)

        user.set_password(serializer.validated_data["password"])
        user.save(update_fields=["password"])

        payload = {
            "status": True,
            "message": "Password updated. You can sign in now.",
            "data": {},
        }
        return Response(payload)


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({"status": True, "message": "Success", "data": UserSerializer(request.user).data})

    def put(self, request):
        """Update the signed-in account's own name and email."""
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        payload = {
            "status": True,
            "message": "Profile updated successfully.",
            "data": UserSerializer(user).data,
        }
        return Response(payload)


class AccountDeactivateView(APIView):
    """Let an account holder switch their own account off.

    Nothing is deleted. `is_active` goes False, which is the same flag an
    administrator toggles, so the account keeps its business, products and
    sales and still appears — marked Inactive — in the admin console and in
    Django admin. Only signing in stops working.

    Reversing it is deliberately not self-service: a deactivated account cannot
    sign in to undo this, so an administrator has to turn it back on.
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user = request.user
        if not user.is_active:
            payload = {
                "status": False,
                "message": "Validation Error",
                "errors": {"account": ["This account is already deactivated."]},
            }
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        user.is_active = False
        user.save(update_fields=["is_active"])

        # Retire the refresh token that came with the request, so the session
        # cannot be extended after the account is off. Sent by the client;
        # absent or already spent is not an error worth failing the request for.
        refresh_token = request.data.get("refresh")
        if refresh_token:
            try:
                blacklist_refresh_token(refresh_token)
            except TokenError:
                pass

        payload = {
            "status": True,
            "message": "Your account has been deactivated.",
            "data": {"is_active": False},
        }
        return Response(payload)


class UserListView(APIView):
    """List every account. Administrators only.

    The User model has carried an `admin`/`user` role from the start; this is
    the first endpoint to enforce it, so an ordinary signed-in account cannot
    read the account list.
    """

    permission_classes = (IsAdminRole,)

    def get(self, request):
        users = User.objects.all().order_by("full_name")
        payload = {
            "status": True,
            "message": "Success",
            "data": UserSerializer(users, many=True).data,
        }
        return Response(payload)
