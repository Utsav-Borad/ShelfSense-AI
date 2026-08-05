"""Business-scoped access to the AI pipeline.

`AnalyticsDatabaseAdapter` deliberately knows nothing about who is asking — it
analyses every product row in the database. The API is multi-tenant, so this
module is the single place that narrows those results down to the products that
belong to one authenticated user's business.

Keeping the filter here means the adapter, the recommendation engine and the
notification engine stay unchanged and reusable.
"""

import threading
import time

from django.db.models import Max
from django.utils import timezone

from business.models import Business
from products.models import Product
from sales.models import Sales

from analytics.services.database_adapter import AnalyticsDatabaseAdapter


class InsightsUnavailable(Exception):
    """Raised when the saved model artifacts cannot produce a result."""


# One dashboard page asks four different endpoints for insights, and each run of
# the pipeline reloads the model, reads every sales row and calls predict() once
# per product — around a second of work. Running that four times over for the
# same unchanged data is the single biggest cost in the API, so a completed
# analysis is held briefly and reused.
#
# The window is deliberately short: a CSV import during it would be reflected
# one refresh late, which is a far better trade than a page that takes half a
# minute to open.
_CACHE_SECONDS = 60
_cache = {}
# Without this, the four requests a dashboard fires all miss the empty cache at
# the same instant and each starts its own run. The lock makes the first one
# compute while the rest wait and then read its result.
_lock = threading.Lock()


def _cached(business_id):
    """Return a still-fresh analysis for this business, or None."""
    entry = _cache.get(business_id)
    if entry is None:
        return None
    stored_at, results = entry
    if time.monotonic() - stored_at > _CACHE_SECONDS:
        del _cache[business_id]
        return None
    return results


def clear_insights_cache(business_id=None):
    """Drop cached analyses — call after data changes if freshness matters."""
    if business_id is None:
        _cache.clear()
    else:
        _cache.pop(business_id, None)


def get_business_for_owner(owner):
    """Return the owner's business, or None when setup is not finished."""
    return Business.objects.filter(owner=owner).first()


def get_product_ids(business):
    """Return the set of product ids owned by one business."""
    return set(
        Product.objects.filter(business=business).values_list("id", flat=True)
    )


def analyze_business(business, adapter=None):
    """Run the full AI pipeline and keep only this business's products.

    Returns a list of ``{forecast, analytics, recommendation, notification}``
    dictionaries — exactly what ``AnalyticsDatabaseAdapter`` produces, minus
    every product belonging to somebody else.
    """
    product_ids = get_product_ids(business)
    if not product_ids:
        return []

    cached = _cached(business.id)
    if cached is not None:
        return cached

    with _lock:
        # Re-check inside the lock: whoever held it first may have just filled
        # the cache while this request was waiting.
        cached = _cached(business.id)
        if cached is not None:
            return cached

        adapter = adapter or _build_adapter()
        try:
            results = adapter.analyze_all_products()
        except (FileNotFoundError, OSError, ValueError) as error:
            raise InsightsUnavailable(str(error)) from error

        scoped = [
            result
            for result in results
            if result["analytics"]["product_id"] in product_ids
        ]
        _cache[business.id] = (time.monotonic(), scoped)
        return scoped


def _build_adapter():
    """Construct the adapter, converting missing artifacts into our own error."""
    try:
        return AnalyticsDatabaseAdapter()
    except (FileNotFoundError, OSError, ValueError) as error:
        raise InsightsUnavailable(str(error)) from error


def latest_sale_date(business):
    """The day reporting windows count back from.

    Sales arrive by CSV import, so the newest row can sit well behind the
    calendar. Anchoring to the most recent sale keeps every report meaningful
    for whatever data has actually been loaded; with live daily imports the
    latest sale is today anyway, so nothing changes.
    """
    newest = Sales.objects.filter(product__business=business).aggregate(
        newest=Max("sale_date")
    )["newest"]
    return newest or timezone.localdate()


def product_names(business):
    """Map product id to product name for labelling AI output."""
    return dict(
        Product.objects.filter(business=business).values_list(
            "id",
            "product_name",
        )
    )
