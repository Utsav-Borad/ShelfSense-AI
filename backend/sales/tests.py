from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from business.models import Business
from categories.models import Category
from products.models import Product
from suppliers.models import Supplier

from .models import Sales


class SalesAPITestCase(TestCase):
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

        self.sale = Sales.objects.create(
            product=self.product,
            invoice_number="INV-1001",
            sale_date="2026-01-15",
            quantity_sold=5,
            selling_price="45.00",
            discount="5.00",
            total_amount="220.00",
        )

    def test_get_sales_list(self):
        response = self.client.get("/api/v1/sales/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["message"], "Success")
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(
            response.data["data"][0]["invoice_number"],
            self.sale.invoice_number,
        )

    def test_get_sale_details(self):
        response = self.client.get(f"/api/v1/sales/{self.sale.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(
            response.data["data"]["invoice_number"],
            self.sale.invoice_number,
        )

    def test_get_sales_history(self):
        response = self.client.get("/api/v1/sales/history/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(len(response.data["data"]), 1)

    def test_get_missing_sale_returns_not_found(self):
        response = self.client.get("/api/v1/sales/999999/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_user_cannot_access_sales(self):
        self.client.force_authenticate(user=None)

        response = self.client.get("/api/v1/sales/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)