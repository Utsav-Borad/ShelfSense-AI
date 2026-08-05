"""Routes for /api/v1/ai/ — the advisory side of the analytics app."""

from django.urls import path

from .ai_views import (
    DeadStockView,
    DiscountView,
    InventoryLossView,
    RecommendationListView,
    ReorderView,
)

urlpatterns = [
    path("recommendations/", RecommendationListView.as_view(), name="ai-recommendations"),
    path("reorder/", ReorderView.as_view(), name="ai-reorder"),
    path("discount/", DiscountView.as_view(), name="ai-discount"),
    path("loss/", InventoryLossView.as_view(), name="ai-loss"),
    path("dead-stock/", DeadStockView.as_view(), name="ai-dead-stock"),
]
