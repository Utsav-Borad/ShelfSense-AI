from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from business.models import Business

from .models import Sales
from .serializers import SalesSerializer
from .services import SalesService


def _get_owner_business_or_404(owner: object) -> Business:
    """Return the authenticated user's business or raise a 404-style API error."""
    try:
        return Business.objects.get(owner=owner)
    except Business.DoesNotExist as error:
        raise NotFound("Business not found.") from error


class SalesListView(APIView):
    """Return all sales records for the authenticated user's business."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = _get_owner_business_or_404(request.user)

        sales = SalesService.get_sales_for_business(business)

        return Response(
            {
                "status": True,
                "message": "Success",
                "data": SalesSerializer(sales, many=True).data,
            }
        )


class SalesDetailView(APIView):
    """Return a single sales record."""

    permission_classes = (IsAuthenticated,)

    def get(self, request, sale_id):
        business = _get_owner_business_or_404(request.user)

        try:
            sale = SalesService.get_sale_by_id(
                business,
                sale_id,
            )
        except Sales.DoesNotExist as error:
            raise NotFound("Sale not found.") from error

        return Response(
            {
                "status": True,
                "message": "Success",
                "data": SalesSerializer(sale).data,
            }
        )


class SalesHistoryView(APIView):
    """Return sales history for the authenticated user's business."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = _get_owner_business_or_404(request.user)

        sales = SalesService.get_sales_history(business)

        return Response(
            {
                "status": True,
                "message": "Sales history retrieved successfully.",
                "data": SalesSerializer(sales, many=True).data,
            }
        )