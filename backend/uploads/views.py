"""CSV upload endpoints — the documented entry point for shop data."""

from rest_framework import status
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.api_base import require_business
from analytics.services.insights import clear_insights_cache

from .services import IMPORTERS, UploadError, read_rows


class CsvUploadView(APIView):
    """POST a CSV under the field name `file`.

    Validation happens before any write, and the import runs in a transaction,
    so a file with a bad row on line 900 leaves the database untouched.
    """

    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser,)
    upload_type = "inventory"

    def post(self, request, *args, **kwargs):
        business = require_business(request.user)

        uploaded = request.FILES.get("file")
        if uploaded is None:
            return Response(
                {
                    "status": False,
                    "message": "Validation Error",
                    "errors": {"file": ["Attach a CSV file under the field name 'file'."]},
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            rows = read_rows(uploaded, self.upload_type)
            result = IMPORTERS[self.upload_type](rows, business)
        except UploadError as error:
            return Response(
                {"status": False, "message": "Validation Error", "errors": {"file": [str(error)]}},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # The AI analysis is cached; new data should be visible immediately.
        clear_insights_cache(business.id)

        payload = {
            "status": True,
            "message": f"{uploaded.name} imported successfully.",
            "data": {
                "type": self.upload_type,
                "file_name": uploaded.name,
                "rows_read": len(rows),
                **result,
            },
        }
        return Response(payload, status=status.HTTP_201_CREATED)


class SalesUploadView(CsvUploadView):
    upload_type = "sales"


class InventoryUploadView(CsvUploadView):
    upload_type = "inventory"


class PurchaseUploadView(CsvUploadView):
    upload_type = "purchase"
