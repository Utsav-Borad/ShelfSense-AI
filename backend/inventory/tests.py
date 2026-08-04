from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from business.models import Business
from categories.models import Category
from products.models import Product
from suppliers.models import Supplier

from .models import Inventory


class InventoryAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = get_user_model().objects.create_user(
            full_name="Test Owner",
            email="owner@example.com",
            password="strong-password-123",
        )
        self.client.force_authenticate(user=self.user)

        self.business = Business.objects.create(
            owner=self.user,
            shop_name="ShelfSense Mart",
            shop_type="Grocery",
            address="12 Market Street",
            phone="9876543210",
            gst_number="GST1234567",
        )

        self.category = Category.objects.create(
            business=self.business,
            category_name="Groceries",
            description="Daily grocery items",
        )

        self.supplier = Supplier.objects.create(
            business=self.business,
            supplier_name="ABC Traders",
            phone="9000000000",
            email="abc@example.com",
            address="45 Supply Road",
            status=Supplier.Status.ACTIVE,
        )

        self.product = Product.objects.create(
            business=self.business,
            category=self.category,
            supplier=self.supplier,
            barcode="1234567890",
            product_name="Milk",
            brand="Fresh Dairy",
            unit="Litre",
            mrp="50.00",
            selling_price="45.00",
            manufacturing_date="2026-01-01",
            expiry_date="2026-12-31",
            minimum_stock=10,
            status=Product.Status.ACTIVE,
        )

        self.inventory = Inventory.objects.create(
            product=self.product,
            available_quantity=25,
            reserved_quantity=5,
            damaged_quantity=1,
        )

    def _create_product(self, business, product_name, minimum_stock=10, expiry_date=None):
        category = Category.objects.create(
            business=business,
            category_name=f"{product_name} Category",
            description="Test category",
        )
        supplier = Supplier.objects.create(
            business=business,
            supplier_name=f"{product_name} Supplier",
            phone="9000000001",
            email=f"{product_name.lower()}@example.com",
            address="1 Test Lane",
            status=Supplier.Status.ACTIVE,
        )
        return Product.objects.create(
            business=business,
            category=category,
            supplier=supplier,
            barcode=f"{product_name.lower()}-barcode",
            product_name=product_name,
            brand="Test Brand",
            unit="Piece",
            mrp="10.00",
            selling_price="8.00",
            manufacturing_date="2026-01-01",
            expiry_date=expiry_date,
            minimum_stock=minimum_stock,
            status=Product.Status.ACTIVE,
        )

    def test_list_inventory_returns_only_current_business_inventory(self):
        other_user = get_user_model().objects.create_user(
            full_name="Other Owner",
            email="other@example.com",
            password="strong-password-123",
        )
        other_business = Business.objects.create(
            owner=other_user,
            shop_name="Other Mart",
            shop_type="Retail",
            address="8 Other Street",
            phone="1111111111",
            gst_number="GST0000000",
        )
        other_product = self._create_product(other_business, "Bread")
        Inventory.objects.create(
            product=other_product,
            available_quantity=10,
            reserved_quantity=0,
            damaged_quantity=0,
        )

        response = self.client.get("/api/v1/inventory/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["id"], self.inventory.id)

    def test_get_inventory_list(self):
        response = self.client.get("/api/v1/inventory/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(len(response.data["data"]), 1)

    def test_get_low_stock_inventory(self):
        low_stock_product = self._create_product(self.business, "Eggs", minimum_stock=10)
        Inventory.objects.create(
            product=low_stock_product,
            available_quantity=5,
            reserved_quantity=0,
            damaged_quantity=0,
        )

        response = self.client.get("/api/v1/inventory/low-stock/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertGreaterEqual(len(response.data["data"]), 1)

    def test_near_expiry_endpoint_returns_success(self):
        near_expiry_product = self._create_product(
            self.business,
            "Cheese",
            expiry_date=timezone.now().date() + timedelta(days=10),
        )
        Inventory.objects.create(
            product=near_expiry_product,
            available_quantity=8,
            reserved_quantity=0,
            damaged_quantity=0,
        )

        response = self.client.get("/api/v1/inventory/near-expiry/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])

    def test_dead_stock_endpoint_returns_success(self):
        dead_stock_product = self._create_product(self.business, "Butter")
        Inventory.objects.create(
            product=dead_stock_product,
            available_quantity=0,
            reserved_quantity=0,
            damaged_quantity=0,
        )

        response = self.client.get("/api/v1/inventory/dead-stock/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])

    def test_unauthenticated_user_cannot_access_inventory(self):
        self.client.force_authenticate(user=None)

        response = self.client.get("/api/v1/inventory/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
