from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "full_name", "email", "role", "created_at")
        read_only_fields = ("id", "role", "created_at")


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
