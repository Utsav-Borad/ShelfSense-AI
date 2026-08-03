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
