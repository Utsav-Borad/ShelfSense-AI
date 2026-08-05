from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.permissions import IsAdminRole
from business.models import Business

from .models import Product
from .serializers import ProductSerializer
from .services import ProductService


def _get_owner_business_or_404(owner: object) -> Business:
    """Return the authenticated user's business or raise a 404-style API error."""
    try:
        return Business.objects.get(owner=owner)
    except Business.DoesNotExist as error:
        raise NotFound("Business not found.") from error


class AdminWriteMixin:
    """Anyone signed in may read; only administrators may write.

    Products are meant to arrive through CSV synchronization, and the API
    documentation marks manual product entry as admin-only. Reads stay open so
    the product pages keep working for every account.
    """

    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]
        return [IsAdminRole()]


class ProductListView(AdminWriteMixin, APIView):
    """Create a product and list products for the authenticated user's business."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = _get_owner_business_or_404(request.user)
        products = ProductService.get_products_for_business(business)
        payload = {
            "status": True,
            "message": "Success",
            "data": ProductSerializer(products, many=True).data,
        }
        return Response(payload)

    def post(self, request):
        business = _get_owner_business_or_404(request.user)
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = ProductService.create_product(business, serializer.validated_data)
        payload = {
            "status": True,
            "message": "Product created successfully.",
            "data": ProductSerializer(product).data,
        }
        return Response(payload, status=status.HTTP_201_CREATED)


class ProductDetailView(AdminWriteMixin, APIView):
    """Retrieve, update, or delete a product for the authenticated user's business."""

    permission_classes = (IsAuthenticated,)

    def get(self, request, product_id):
        business = _get_owner_business_or_404(request.user)
        try:
            product = ProductService.get_product_for_business(business, product_id)
        except Product.DoesNotExist as error:
            raise NotFound("Product not found.") from error

        payload = {
            "status": True,
            "message": "Success",
            "data": ProductSerializer(product).data,
        }
        return Response(payload)

    def put(self, request, product_id):
        business = _get_owner_business_or_404(request.user)
        try:
            product = ProductService.get_product_for_business(business, product_id)
        except Product.DoesNotExist as error:
            raise NotFound("Product not found.") from error

        serializer = ProductSerializer(product, data=request.data)
        serializer.is_valid(raise_exception=True)
        updated_product = ProductService.update_product(product, serializer.validated_data)
        payload = {
            "status": True,
            "message": "Product updated successfully.",
            "data": ProductSerializer(updated_product).data,
        }
        return Response(payload)

    def delete(self, request, product_id):
        business = _get_owner_business_or_404(request.user)
        try:
            product = ProductService.get_product_for_business(business, product_id)
        except Product.DoesNotExist as error:
            raise NotFound("Product not found.") from error

        ProductService.delete_product(product)
        payload = {
            "status": True,
            "message": "Product deleted successfully.",
            "data": {},
        }
        return Response(payload)
