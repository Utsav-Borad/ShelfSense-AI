from django.urls import path

from .views import (
    DeadStockView,
    InventoryListView,
    LowStockView,
    NearExpiryView,
)

urlpatterns = [
    path("", InventoryListView.as_view(), name="inventory-list"),
    path("low-stock/", LowStockView.as_view(), name="inventory-low-stock"),
    path("near-expiry/", NearExpiryView.as_view(), name="inventory-near-expiry"),
    path("dead-stock/", DeadStockView.as_view(), name="inventory-dead-stock"),
]