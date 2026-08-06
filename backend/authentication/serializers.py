from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "full_name", "email", "role", "is_active", "created_at")
        read_only_fields = ("id", "role", "is_active", "created_at")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    password_confirmation = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = User
        fields = ("full_name", "email", "password", "password_confirmation")

    def validate_email(self, value):
        return value.lower()

    def validate(self, attributes):
        if attributes["password"] != attributes["password_confirmation"]:
            raise serializers.ValidationError({"password_confirmation": "Passwords do not match."})
        return attributes

    def create(self, validated_data):
        validated_data.pop("password_confirmation")
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_email(self, value):
        return value.lower()

    def validate(self, attributes):
        user = authenticate(email=attributes["email"], password=attributes["password"])
        if user is None:
            raise serializers.ValidationError({"credentials": "Invalid email or password."})
        if not user.is_active:
            raise serializers.ValidationError({"credentials": "This account is inactive."})
        attributes["user"] = user
        return attributes


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """The two profile fields an account holder may change themselves.

    `role` stays out on purpose: an ordinary user must not be able to promote
    their own account by editing their profile.
    """

    class Meta:
        model = User
        fields = ("full_name", "email")

    def validate_email(self, value):
        value = value.lower()
        taken = User.objects.filter(email=value)
        if self.instance is not None:
            taken = taken.exclude(pk=self.instance.pk)
        if taken.exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """The two things an administrator may change about another account.

    Name and email stay out: those belong to the account holder and are edited
    through ProfileUpdateSerializer.
    """

    class Meta:
        model = User
        fields = ("role", "is_active")


class TokenRefreshSerializer(serializers.Serializer):
    """Accept the stored refresh token so a new access token can be issued."""

    refresh = serializers.CharField()


class PasswordResetRequestSerializer(serializers.Serializer):
    """Accept the email a reset was requested for."""

    email = serializers.EmailField()

    def validate_email(self, value):
        return value.lower()


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Validate a reset token and the replacement password.

    The frontend keeps a single opaque `token` string in the reset link, so the
    user id and Django's reset token travel together as "<uidb64>.<token>" and
    are split apart here.
    """

    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)
    password_confirmation = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attributes):
        if attributes["password"] != attributes["password_confirmation"]:
            raise serializers.ValidationError({"password_confirmation": "Passwords do not match."})

        encoded_id, separator, reset_token = attributes["token"].partition(".")
        if not separator:
            raise serializers.ValidationError({"token": "This reset link is not valid."})

        try:
            user_id = force_str(urlsafe_base64_decode(encoded_id))
            user = User.objects.get(pk=user_id)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist) as error:
            raise serializers.ValidationError({"token": "This reset link is not valid."}) from error

        if not default_token_generator.check_token(user, reset_token):
            raise serializers.ValidationError(
                {"token": "This reset link has expired or has already been used."}
            )

        attributes["user"] = user
        return attributes
