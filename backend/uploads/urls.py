from django.urls import path

from .views import InventoryUploadView, PurchaseUploadView, SalesUploadView

urlpatterns = [
    path("sales/", SalesUploadView.as_view(), name="upload-sales"),
    path("inventory/", InventoryUploadView.as_view(), name="upload-inventory"),
    path("purchase/", PurchaseUploadView.as_view(), name="upload-purchase"),
]
