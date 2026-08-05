"""REST endpoints for the AI notification engine.

The notification *logic* lives in `analytics/notification/notification_engine.py`
and is intentionally Django-free so it can be reused and tested on its own.
This app is the thin HTTP layer that exposes it to the frontend, scoped to the
authenticated user's business.
"""

from smtplib import SMTPException

from django.conf import settings
from django.core.mail import send_mail
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.api_base import (
    BusinessInsightsView,
    require_business,
    success,
    unavailable,
)
from analytics.services.insights import (
    InsightsUnavailable,
    analyze_business,
    product_names,
)

SEVERITY_ORDER = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}


def _decorate(results, names):
    """Attach the product name to each notification and sort by severity."""
    notifications = []
    for result in results:
        notification = dict(result["notification"])
        notification["product_name"] = names.get(
            notification["product_id"],
            "Unknown product",
        )
        notifications.append(notification)

    notifications.sort(
        key=lambda item: SEVERITY_ORDER.get(item["severity"], len(SEVERITY_ORDER))
    )
    return notifications


class NotificationListView(BusinessInsightsView):
    """Current notifications, most severe first, healthy stock excluded."""

    def build_response(self, request, business, results):
        notifications = [
            notification
            for notification in _decorate(results, product_names(business))
            if notification["notification_type"] != "HEALTHY_INVENTORY"
        ]
        return success(
            {"count": len(notifications), "notifications": notifications},
            "Notifications retrieved successfully.",
        )


class NotificationEmailView(APIView):
    """Email the current notification digest to the signed-in owner.

    POST only — this endpoint sends something, so it must not be reachable by a
    GET. Nothing is stored; the digest is built from live inventory each time.
    """

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        business = require_business(request.user)
        try:
            results = analyze_business(business)
        except InsightsUnavailable as error:
            return unavailable(error)

        notifications = [
            notification
            for notification in _decorate(results, product_names(business))
            if notification["notification_type"] != "HEALTHY_INVENTORY"
        ]

        if not notifications:
            return success(
                {"sent": False, "count": 0, "recipient": request.user.email},
                "Nothing needs attention, so no email was sent.",
            )

        lines = [
            f"Hello {request.user.full_name},",
            "",
            f"{len(notifications)} item(s) in {business.shop_name} need attention:",
            "",
        ]
        lines += [
            f"[{item['severity']}] {item['product_name']} — {item['title']}\n"
            f"    {item['message']}"
            for item in notifications
        ]
        lines += ["", "Open ShelfSense AI to review the details.", "", "— ShelfSense AI"]

        try:
            sent = send_mail(
                subject=f"ShelfSense AI — {len(notifications)} item(s) need attention",
                message="\n".join(lines),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[request.user.email],
                fail_silently=False,
            )
        except (OSError, SMTPException) as error:
            return Response(
                {
                    "status": False,
                    "message": "The notification email could not be sent.",
                    "errors": {"email": [str(error)]},
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return success(
            {
                "sent": bool(sent),
                "count": len(notifications),
                "recipient": request.user.email,
            },
            "Notification digest sent.",
        )


class NotificationHistoryView(BusinessInsightsView):
    """Every notification the engine produced, including healthy products.

    Notifications are derived live from current inventory rather than stored, so
    "history" is the complete unfiltered set for this business.
    """

    def build_response(self, request, business, results):
        notifications = _decorate(results, product_names(business))
        counts = {}
        for notification in notifications:
            key = notification["notification_type"]
            counts[key] = counts.get(key, 0) + 1

        return success(
            {
                "count": len(notifications),
                "counts_by_type": counts,
                "notifications": notifications,
            },
            "Notification history retrieved successfully.",
        )
