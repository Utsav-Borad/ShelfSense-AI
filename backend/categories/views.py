from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from business.models import Business

from .models import Category
from .serializers import CategorySerializer
from .services import CategoryService


def _get_owner_business_or_404(owner: object) -> Business:
    """Return the authenticated user's business or raise a 404-style API error."""
    try:
        return Business.objects.get(owner=owner)
    except Business.DoesNotExist as error:
        raise NotFound("Business not found.") from error


class CategoryListView(APIView):
    """Create a category and list categories for the authenticated user's business."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        business = _get_owner_business_or_404(request.user)
        categories = CategoryService.get_categories_for_business(business)
        payload = {
            "status": True,
            "message": "Success",
            "data": CategorySerializer(categories, many=True).data,
        }
        return Response(payload)

    def post(self, request):
        business = _get_owner_business_or_404(request.user)
        serializer = CategorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = CategoryService.create_category(business, serializer.validated_data)
        payload = {
            "status": True,
            "message": "Category created successfully.",
            "data": CategorySerializer(category).data,
        }
        return Response(payload, status=status.HTTP_201_CREATED)


class CategoryDetailView(APIView):
    """Retrieve, update, or delete a category for the authenticated user's business."""

    permission_classes = (IsAuthenticated,)

    def get(self, request, category_id):
        business = _get_owner_business_or_404(request.user)
        try:
            category = CategoryService.get_category_for_business(business, category_id)
        except Category.DoesNotExist as error:
            raise NotFound("Category not found.") from error

        payload = {
            "status": True,
            "message": "Success",
            "data": CategorySerializer(category).data,
        }
        return Response(payload)

    def put(self, request, category_id):
        business = _get_owner_business_or_404(request.user)
        try:
            category = CategoryService.get_category_for_business(business, category_id)
        except Category.DoesNotExist as error:
            raise NotFound("Category not found.") from error

        serializer = CategorySerializer(category, data=request.data)
        serializer.is_valid(raise_exception=True)
        updated_category = CategoryService.update_category(category, serializer.validated_data)
        payload = {
            "status": True,
            "message": "Category updated successfully.",
            "data": CategorySerializer(updated_category).data,
        }
        return Response(payload)

    def delete(self, request, category_id):
        business = _get_owner_business_or_404(request.user)
        try:
            category = CategoryService.get_category_for_business(business, category_id)
        except Category.DoesNotExist as error:
            raise NotFound("Category not found.") from error

        CategoryService.delete_category(category)
        payload = {
            "status": True,
            "message": "Category deleted successfully.",
            "data": {},
        }
        return Response(payload)
