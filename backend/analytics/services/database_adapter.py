"""Adapt live Django business records to the reusable AI analytics pipeline."""

from analytics.notification.notification_engine import NotificationEngine
from analytics.recommendation.recommendation_engine import RecommendationEngine
from analytics.services.analytics_engine import ProductAnalyticsEngine
from analytics.services.repository import (
    get_businesses,
    get_categories,
    get_inventory,
    get_latest_sale_values,
    get_products,
    get_suppliers,
)


class AnalyticsDatabaseAdapter:
    """Run the saved AI pipeline for complete live database product records."""

    def __init__(
        self,
        analytics_engine=None,
        recommendation_engine=None,
        notification_engine=None,
    ):
        self.analytics_engine = analytics_engine or ProductAnalyticsEngine()
        self.recommendation_engine = recommendation_engine or RecommendationEngine(
            analytics_engine=self.analytics_engine,
        )
        self.notification_engine = notification_engine or NotificationEngine(
            recommendation_engine=self.recommendation_engine,
        )

    @staticmethod
    def _record_map(records):
        return {record.id: record for record in records}

    def _load_records(self):
        """Read all required live data through the analytics repository layer."""
        return {
            "products": list(get_products()),
            "inventory": {
                record.product_id: record for record in get_inventory()
            },
            "sales": get_latest_sale_values(),
            "categories": self._record_map(get_categories()),
            "suppliers": self._record_map(get_suppliers()),
            "businesses": self._record_map(get_businesses()),
        }

    @staticmethod
    def _complete_text(value):
        return isinstance(value, str) and bool(value.strip())

    def _build_feature_payload(self, product, records):
        """Build the Forecast Engine input from related database records.

        Returns ``None`` for incomplete product data so batch analysis can
        safely skip records that cannot produce a reliable AI result.
        """
        inventory = records["inventory"].get(product.id)
        sale = records["sales"].get(product.id)
        category = records["categories"].get(product.category_id)
        supplier = records["suppliers"].get(product.supplier_id)
        business = records["businesses"].get(product.business_id)

        required_records = (inventory, sale, category, supplier, business)
        if any(record is None for record in required_records):
            return None

        text_fields = (
            product.product_name,
            product.brand,
            product.unit,
            product.status,
            category.category_name,
            category.description,
            supplier.supplier_name,
            supplier.status,
            business.shop_type,
        )
        numeric_fields = (
            product.mrp,
            product.selling_price,
            product.minimum_stock,
            inventory.available_quantity,
            inventory.reserved_quantity,
            inventory.damaged_quantity,
            sale["selling_price"],
            sale["discount"],
        )
        if (
            product.expiry_date is None
            or sale["sale_date"] is None
            or not all(self._complete_text(value) for value in text_fields)
            or any(value is None for value in numeric_fields)
        ):
            return None

        return {
            "product_id": product.id,
            "product_name": product.product_name,
            "brand": product.brand,
            "unit": product.unit,
            "mrp": product.mrp,
            "selling_price": product.selling_price,
            "minimum_stock": product.minimum_stock,
            "status": product.status,
            "available_quantity": inventory.available_quantity,
            "reserved_quantity": inventory.reserved_quantity,
            "damaged_quantity": inventory.damaged_quantity,
            "expiry_date": product.expiry_date.isoformat(),
            "category_name": category.category_name,
            "description": category.description,
            "supplier_name": supplier.supplier_name,
            "status_supplier": supplier.status,
            "shop_type": business.shop_type,
            "selling_price_sale": sale["selling_price"],
            "discount": sale["discount"],
            "forecast_date": sale["sale_date"].isoformat(),
        }

    def _analyze_product_record(self, product, records):
        payload = self._build_feature_payload(product, records)
        if payload is None:
            return None

        forecast = self.analytics_engine.forecast_engine.predict(payload)
        analytics = self.analytics_engine.analyze_product(
            payload,
            forecast=forecast,
        )
        recommendation = self.recommendation_engine.recommend_from_analytics(
            analytics,
        )
        notification = self.notification_engine.notification_from_recommendation(
            recommendation,
        )

        return {
            "forecast": forecast,
            "analytics": analytics,
            "recommendation": recommendation,
            "notification": notification,
        }

    def analyze_product(self, product_id):
        """Analyze one product, returning ``None`` when its data is incomplete."""
        records = self._load_records()
        product = next(
            (record for record in records["products"] if record.id == product_id),
            None,
        )
        if product is None:
            return None
        return self._analyze_product_record(product, records)

    def analyze_all_products(self):
        """Analyze every complete product record, skipping incomplete records."""
        records = self._load_records()
        return [
            result
            for product in records["products"]
            if (result := self._analyze_product_record(product, records))
            is not None
        ]
