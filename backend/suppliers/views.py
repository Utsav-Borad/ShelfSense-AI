from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from business.models import Business

from .models import Supplier
from .serializers import SupplierSerializer
from .services import SupplierService


def _get_owner_business_or_404(owner: object) -> Business:
    """Return the authenticated user's business or raise a 404-style API error."""
    try:
        return Business.objects.get(owner=owner)
    except Business.DoesNotExist as error:
        raise NotFound("Business not found.") from error


class SupplierListView(APIView):
    """Create a supplier and list suppliers for the authenticated user's business."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = _get_owner_business_or_404(request.user)
        suppliers = SupplierService.get_suppliers_for_business(business)
        payload = {
            "status": True,
            "message": "Success",
            "data": SupplierSerializer(suppliers, many=True).data,
        }
        return Response(payload)

    def post(self, request):
        business = _get_owner_business_or_404(request.user)
        serializer = SupplierSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        supplier = SupplierService.create_supplier(business, serializer.validated_data)
        payload = {
            "status": True,
            "message": "Supplier created successfully.",
            "data": SupplierSerializer(supplier).data,
        }
        return Response(payload, status=status.HTTP_201_CREATED)


class SupplierDetailView(APIView):
    """Retrieve, update, or delete a supplier for the authenticated user's business."""

    permission_classes = (IsAuthenticated,)

    def get(self, request, supplier_id):
        business = _get_owner_business_or_404(request.user)
        try:
            supplier = SupplierService.get_supplier_for_business(business, supplier_id)
        except Supplier.DoesNotExist as error:
            raise NotFound("Supplier not found.") from error

        payload = {
            "status": True,
            "message": "Success",
            "data": SupplierSerializer(supplier).data,
        }
        return Response(payload)

    def put(self, request, supplier_id):
        business = _get_owner_business_or_404(request.user)
        try:
            supplier = SupplierService.get_supplier_for_business(business, supplier_id)
        except Supplier.DoesNotExist as error:
            raise NotFound("Supplier not found.") from error

        serializer = SupplierSerializer(supplier, data=request.data)
        serializer.is_valid(raise_exception=True)
        updated_supplier = SupplierService.update_supplier(supplier, serializer.validated_data)
        payload = {
            "status": True,
            "message": "Supplier updated successfully.",
            "data": SupplierSerializer(updated_supplier).data,
        }
        return Response(payload)

    def delete(self, request, supplier_id):
        business = _get_owner_business_or_404(request.user)
        try:
            supplier = SupplierService.get_supplier_for_business(business, supplier_id)
        except Supplier.DoesNotExist as error:
            raise NotFound("Supplier not found.") from error

        SupplierService.delete_supplier(supplier)
        payload = {
            "status": True,
            "message": "Supplier deleted successfully.",
            "data": {},
        }
        return Response(payload)
