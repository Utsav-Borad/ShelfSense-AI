from rest_framework.permissions import BasePermission


class IsAdminRole(BasePermission):
    """Allow only accounts whose `role` is `admin`.

    The User model already carries a role of `admin` or `user`; this turns that
    field into an enforceable API rule so admin-only data cannot be read by an
    ordinary signed-in account.
    """

    message = "This action requires an administrator account."

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.role == user.Role.ADMIN
        )
