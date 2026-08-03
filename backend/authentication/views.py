from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError

from .serializers import LoginSerializer, LogoutSerializer, RegisterSerializer, UserSerializer
from .services import blacklist_refresh_token, create_token_response


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


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response({"status": True, "message": "Success", "data": UserSerializer(request.user).data})
