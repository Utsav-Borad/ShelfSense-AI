from django.urls import path

from .views import DemandForecastView


urlpatterns = [
    path(
        "demand-forecast/",
        DemandForecastView.as_view(),
        name="demand-forecast",
    ),
]
