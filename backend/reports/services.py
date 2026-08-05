"""Executive report figures built from the sales table with pandas.

Reporting is aggregation, not machine learning, so this app reads sales through
the ORM and does the grouping with pandas rather than going through the AI
pipeline. The AI narrative that sits on top of these numbers comes from the
`analytics` engines and is attached by the views.
"""

from datetime import timedelta

import pandas as pd

from analytics.services.insights import latest_sale_date
from sales.models import Sales

COLUMNS = (
    "id",
    "sale_date",
    "quantity_sold",
    "discount",
    "total_amount",
    "product__product_name",
)


def load_sales_frame(business):
    """Return this business's sales as a DataFrame with numeric columns."""
    records = list(
        Sales.objects.filter(product__business=business).values(*COLUMNS)
    )
    frame = pd.DataFrame(records, columns=list(COLUMNS))
    if frame.empty:
        return frame

    frame["sale_date"] = pd.to_datetime(frame["sale_date"], errors="coerce")
    for column in ("quantity_sold", "discount", "total_amount"):
        frame[column] = pd.to_numeric(frame[column], errors="coerce").fillna(0.0)

    return frame.dropna(subset=["sale_date"])


def _empty_report(label, start_date, end_date):
    return {
        "period": label,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "totals": {
            "revenue": 0.0,
            "units_sold": 0,
            "invoices": 0,
            "discount": 0.0,
            "average_order_value": 0.0,
        },
        "top_products": [],
        "daily_breakdown": [],
    }


def build_report(business, label, days):
    """Aggregate the last `days` days of sales into one report payload."""
    end_date = latest_sale_date(business)
    start_date = end_date - timedelta(days=days - 1)

    frame = load_sales_frame(business)
    if frame.empty:
        return _empty_report(label, start_date, end_date)

    mask = (frame["sale_date"] >= pd.Timestamp(start_date)) & (
        frame["sale_date"] <= pd.Timestamp(end_date)
    )
    period = frame.loc[mask]
    if period.empty:
        return _empty_report(label, start_date, end_date)

    revenue = float(period["total_amount"].sum())
    invoices = int(period["id"].nunique())

    top_products = (
        period.groupby("product__product_name")
        .agg(revenue=("total_amount", "sum"), units_sold=("quantity_sold", "sum"))
        .sort_values("revenue", ascending=False)
        .head(5)
        .reset_index()
    )

    daily = (
        period.groupby(period["sale_date"].dt.date)
        .agg(
            revenue=("total_amount", "sum"),
            units_sold=("quantity_sold", "sum"),
            invoices=("id", "nunique"),
        )
        .sort_index()
        .reset_index()
        .rename(columns={"sale_date": "date"})
    )

    return {
        "period": label,
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "totals": {
            "revenue": round(revenue, 2),
            "units_sold": int(period["quantity_sold"].sum()),
            "invoices": invoices,
            "discount": round(float(period["discount"].sum()), 2),
            "average_order_value": round(revenue / invoices, 2) if invoices else 0.0,
        },
        "top_products": [
            {
                "product_name": row["product__product_name"],
                "revenue": round(float(row["revenue"]), 2),
                "units_sold": int(row["units_sold"]),
            }
            for _, row in top_products.iterrows()
        ],
        "daily_breakdown": [
            {
                "date": row["date"].isoformat(),
                "revenue": round(float(row["revenue"]), 2),
                "units_sold": int(row["units_sold"]),
                "invoices": int(row["invoices"]),
            }
            for _, row in daily.iterrows()
        ],
    }
