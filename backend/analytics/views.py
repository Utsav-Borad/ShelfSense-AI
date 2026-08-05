from datetime import date

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.ml.forecast_engine import DemandForecastEngine


class DemandForecastView(APIView):
    """Expose the persisted demand model through the analytics API."""

    REQUIRED_TEXT_FIELDS = (
        "product_name",
        "brand",
        "unit",
        "status",
        "category_name",
        "description",
        "supplier_name",
        "status_supplier",
        "shop_type",
        "expiry_date",
    )
    REQUIRED_NUMERIC_FIELDS = (
        "mrp",
        "selling_price",
        "minimum_stock",
        "available_quantity",
        "reserved_quantity",
        "damaged_quantity",
        "selling_price_sale",
        "discount",
    )

    @classmethod
    def _validate_payload(cls, payload):
        if not isinstance(payload, dict):
            return {"request": "A JSON object is required."}

        errors = {}
        product_id = payload.get("product_id")
        if isinstance(product_id, bool) or not isinstance(product_id, int):
            errors["product_id"] = "A positive integer is required."
        elif product_id <= 0:
            errors["product_id"] = "Must be greater than zero."

        for field in cls.REQUIRED_TEXT_FIELDS:
            if not isinstance(payload.get(field), str) or not payload[field].strip():
                errors[field] = "A non-empty string is required."

        for field in cls.REQUIRED_NUMERIC_FIELDS:
            value = payload.get(field)
            if isinstance(value, bool):
                errors[field] = "A non-negative number is required."
                continue
            try:
                if float(value) < 0:
                    raise ValueError
            except (TypeError, ValueError):
                errors[field] = "A non-negative number is required."

        for field in ("expiry_date", "forecast_date"):
            if field not in payload:
                continue
            try:
                date.fromisoformat(payload[field])
            except (TypeError, ValueError):
                errors[field] = "Use ISO date format YYYY-MM-DD."

        return errors

    def post(self, request):
        errors = self._validate_payload(request.data)
        if errors:
            return Response(
                {"status": False, "message": "Validation Error", "errors": errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = DemandForecastEngine().predict(request.data)
        except (FileNotFoundError, OSError, ValueError) as error:
            return Response(
                {
                    "status": False,
                    "message": "Demand forecast is unavailable.",
                    "errors": {"engine": [str(error)]},
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Same {status, message, data} envelope as every other endpoint.
        return Response(
            {"status": True, "message": "Success", "data": result},
            status=status.HTTP_200_OK,
        )
