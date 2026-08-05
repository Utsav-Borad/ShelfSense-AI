"""Shared pieces for every view that serves AI pipeline output.

The AI apps (`analytics`, `ai`, `reports`, `notifications`) all need the same
three things: the project response envelope, the caller's business, and a
graceful answer when the saved model artifacts are missing. They live here so
the individual views stay short and cannot drift apart.
"""

from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.services.insights import (
    InsightsUnavailable,
    analyze_business,
    get_business_for_owner,
)


def success(data, message="Success"):
    """Wrap a payload in the project's {status, message, data} envelope."""
    return Response({"status": True, "message": message, "data": data})


def unavailable(error):
    """Report that the trained model could not be used, without a 500."""
    return Response(
        {
            "status": False,
            "message": "AI insights are unavailable.",
            "errors": {"engine": [str(error)]},
        },
        status=status.HTTP_503_SERVICE_UNAVAILABLE,
    )


def require_business(user):
    """Return the caller's business or raise the API's 404."""
    business = get_business_for_owner(user)
    if business is None:
        raise NotFound("Business not found.")
    return business


class BusinessInsightsView(APIView):
    """GET view that hands its subclass this business's analysed products.

    Subclasses implement `build_response(request, business, results)`, where
    `results` is the list of {forecast, analytics, recommendation, notification}
    dictionaries for the caller's own products only.
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        business = require_business(request.user)
        try:
            results = analyze_business(business)
        except InsightsUnavailable as error:
            return unavailable(error)
        return self.build_response(request, business, results)

    def build_response(self, request, business, results):
        raise NotImplementedError
