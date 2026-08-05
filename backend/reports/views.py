"""REST endpoints for executive sales reports.

`daily`, `weekly` and `monthly` return the same payload shape over different
windows, so the frontend can render one component for all three. `export`
returns the same figures as a CSV download.
"""

import csv

from django.http import HttpResponse
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from analytics.api_base import require_business, success

from .services import build_report

# Window length in days for each named period.
PERIODS = {"daily": 1, "weekly": 7, "monthly": 30}


class _PeriodReportView(APIView):
    """Base view for the three fixed reporting windows."""

    permission_classes = (IsAuthenticated,)
    period = "daily"

    def get(self, request):
        business = require_business(request.user)
        report = build_report(business, self.period, PERIODS[self.period])
        return success(report, f"{self.period.capitalize()} report generated.")


class DailyReportView(_PeriodReportView):
    period = "daily"


class WeeklyReportView(_PeriodReportView):
    period = "weekly"


class MonthlyReportView(_PeriodReportView):
    period = "monthly"


class ReportExportView(APIView):
    """Download a report's daily breakdown as CSV.

    Query parameter: ?period=daily|weekly|monthly (defaults to monthly).
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        period = request.query_params.get("period", "monthly").lower()
        if period not in PERIODS:
            raise ValidationError(
                {"period": [f"Choose one of: {', '.join(sorted(PERIODS))}."]}
            )

        business = require_business(request.user)
        report = build_report(business, period, PERIODS[period])

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = (
            f'attachment; filename="shelfsense-{period}-report.csv"'
        )

        writer = csv.writer(response)
        writer.writerow(["Date", "Revenue", "Units sold", "Invoices"])
        for row in report["daily_breakdown"]:
            writer.writerow(
                [row["date"], row["revenue"], row["units_sold"], row["invoices"]]
            )
        writer.writerow([])
        writer.writerow(["Total revenue", report["totals"]["revenue"]])
        writer.writerow(["Total units", report["totals"]["units_sold"]])
        writer.writerow(["Invoices", report["totals"]["invoices"]])

        return response
