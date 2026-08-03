from django.urls import path

from .views import BusinessDetailView, BusinessView


urlpatterns = [
    path("", BusinessView.as_view(), name="business"),
    path("<int:business_id>/", BusinessDetailView.as_view(), name="business-detail"),
]
