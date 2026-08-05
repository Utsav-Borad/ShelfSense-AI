from django.urls import path

from .views import (
    NotificationEmailView,
    NotificationHistoryView,
    NotificationListView,
)

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("history/", NotificationHistoryView.as_view(), name="notification-history"),
    path("email/", NotificationEmailView.as_view(), name="notification-email"),
]
