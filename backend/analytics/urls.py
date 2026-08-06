from django.urls import path

from .summary_views import (
    CategoryAnalyticsView,
    DashboardView,
    InventoryAnalyticsView,
    RevenueAnalyticsView,
    SupplierAnalyticsView,
    TrendsAnalyticsView,
)
from .views import DemandForecastView


urlpatterns = [
    path(
        "demand-forecast/",
        DemandForecastView.as_view(),
        name="demand-forecast",
    ),
    path("dashboard/", DashboardView.as_view(), name="analytics-dashboard"),
    path("revenue/", RevenueAnalyticsView.as_view(), name="analytics-revenue"),
    path("inventory/", InventoryAnalyticsView.as_view(), name="analytics-inventory"),
    path("trends/", TrendsAnalyticsView.as_view(), name="analytics-trends"),
    path("suppliers/", SupplierAnalyticsView.as_view(), name="analytics-suppliers"),
    path("categories/", CategoryAnalyticsView.as_view(), name="analytics-categories"),
]
