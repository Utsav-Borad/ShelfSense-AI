from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Business
from .serializers import BusinessSerializer
from .services import BusinessService


def _get_owner_business_or_404(owner: object) -> Business:
    """Return an owner's business or convert its absence to an API 404."""
    try:
        return BusinessService.get_business_for_owner(owner)
    except Business.DoesNotExist as error:
        raise NotFound("Business not found.") from error


class BusinessView(APIView):
    """Create and retrieve the authenticated user's business."""

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        # "No business yet" is a normal state for a freshly registered user, not
        # an error, so it returns data: null instead of a 404. The frontend uses
        # this to decide whether to send the user to business setup.
        try:
            business = BusinessService.get_business_for_owner(request.user)
        except Business.DoesNotExist:
            return Response({
                "status": True,
                "message": "No business has been set up yet.",
                "data": None,
            })

        payload = {
            "status": True,
            "message": "Success",
            "data": BusinessSerializer(business).data,
        }
        return Response(payload)

    def post(self, request):
        try:
            BusinessService.get_business_for_owner(request.user)
        except Business.DoesNotExist:
            pass
        else:
            payload = {
                "status": False,
                "message": "Validation Error",
                "errors": {"business": ["A business already exists for this user."]},
            }
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        serializer = BusinessSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        business = BusinessService.create_business(request.user, serializer.validated_data)
        payload = {
            "status": True,
            "message": "Business created successfully.",
            "data": BusinessSerializer(business).data,
        }
        return Response(payload, status=status.HTTP_201_CREATED)


class BusinessDetailView(APIView):
    """Update the authenticated user's business."""

    permission_classes = (IsAuthenticated,)

    def put(self, request, business_id):
        business = _get_owner_business_or_404(request.user)
        if business.id != business_id:
            raise NotFound("Business not found.")

        serializer = BusinessSerializer(business, data=request.data)
        serializer.is_valid(raise_exception=True)
        updated_business = BusinessService.update_business(business, serializer.validated_data)
        payload = {
            "status": True,
            "message": "Business updated successfully.",
            "data": BusinessSerializer(updated_business).data,
        }
        return Response(payload)
