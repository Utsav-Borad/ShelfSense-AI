from django.urls import path

from .admin_views import (
    AdminAccountListView,
    AdminBusinessListView,
    AdminOverviewView,
    AdminUserDetailView,
)
from .views import (
    LoginView,
    LogoutView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    ProfileView,
    RegisterView,
    TokenRefreshView,
    UserListView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:user_id>/", AdminUserDetailView.as_view(), name="user-detail"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("password-reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path(
        "password-reset/confirm/",
        PasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    # Platform administration. Administrators only; see admin_views.py.
    path("admin/overview/", AdminOverviewView.as_view(), name="admin-overview"),
    path("admin/accounts/", AdminAccountListView.as_view(), name="admin-accounts"),
    path("admin/businesses/", AdminBusinessListView.as_view(), name="admin-businesses"),
]
