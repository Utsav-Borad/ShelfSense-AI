from django.urls import path

from .views import (
    SalesDetailView,
    SalesHistoryView,
    SalesListView,
)

urlpatterns = [
    path("", SalesListView.as_view(), name="sales-list"),
    path("history/", SalesHistoryView.as_view(), name="sales-history"),
    path("<int:sale_id>/", SalesDetailView.as_view(), name="sales-detail"),
]