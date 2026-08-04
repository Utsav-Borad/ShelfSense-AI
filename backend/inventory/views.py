from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound

from business.models import Business

from .serializers import InventorySerializer
from .services import InventoryService


def _get_owner_business_or_404(owner: object) -> Business:
    """Return the authenticated user's business or raise a 404-style API error."""
    try:
        return Business.objects.get(owner=owner)
    except Business.DoesNotExist as error:
        raise NotFound("Business not found.") from error


class InventoryListView(APIView):
    """Return all inventory records for the authenticated user's business."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = _get_owner_business_or_404(request.user)

        inventory = InventoryService.get_inventory_for_business(business)

        return Response(
            {
                "status": True,
                "message": "Success",
                "data": InventorySerializer(inventory, many=True).data,
            }
        )


class LowStockView(APIView):
    """Return inventory records that are below the minimum stock level."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = _get_owner_business_or_404(request.user)

        inventory = InventoryService.get_low_stock(business)

        return Response(
            {
                "status": True,
                "message": "Low stock inventory retrieved successfully.",
                "data": InventorySerializer(inventory, many=True).data,
            }
        )


class NearExpiryView(APIView):
    """Placeholder endpoint until Purchase CSV synchronization is implemented."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = _get_owner_business_or_404(request.user)

        inventory = InventoryService.get_near_expiry(business)

        return Response(
            {
                "status": True,
                "message": "Near expiry inventory retrieved successfully.",
                "data": InventorySerializer(inventory, many=True).data,
            }
        )


class DeadStockView(APIView):
    """Placeholder endpoint until Sales analytics is implemented."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = _get_owner_business_or_404(request.user)

        inventory = InventoryService.get_dead_stock(business)

        return Response(
            {
                "status": True,
                "message": "Dead stock inventory retrieved successfully.",
                "data": InventorySerializer(inventory, many=True).data,
            }
        )