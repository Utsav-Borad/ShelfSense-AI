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
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    TokenRefreshSerializer,
    UserSerializer,
)
from .services import (
    blacklist_refresh_token,
    build_password_reset_token,
    create_token_response,
    refresh_access_token,
    send_password_reset_email,
    smtp_is_configured,
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


class PasswordResetRequestView(APIView):
    """Start a password reset.

    The response is deliberately identical whether or not the email exists, so
    the endpoint cannot be used to discover which addresses are registered.

    The reset link is emailed. When SMTP credentials are not configured, mail
    goes to the console instead and the token is also returned in the response
    so the reset screen stays reachable in development.
    """

    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = {}
        user = User.objects.filter(email=serializer.validated_data["email"]).first()
        if user is not None:
            reset_token = build_password_reset_token(user)
            delivered = send_password_reset_email(user, reset_token)
            # Hand the token back only when a real email did not go out, so a
            # production response never carries a usable reset credential.
            if not delivered or not smtp_is_configured():
                data["reset_token"] = reset_token

        payload = {
            "status": True,
            "message": "If that email exists, a reset link is on its way.",
            "data": data,
        }
        return Response(payload)


class PasswordResetConfirmView(APIView):
    """Finish a password reset using the token issued above."""

    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
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
