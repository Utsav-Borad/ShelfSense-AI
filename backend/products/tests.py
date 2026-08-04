from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from business.models import Business
from categories.models import Category
from suppliers.models import Supplier

from .models import Product


class ProductAPITestCase(TestCase):
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

        self.product_payload = {
            "category": self.category.id,
            "supplier": self.supplier.id,
            "barcode": "1234567890",
            "product_name": "Milk",
            "brand": "Fresh Dairy",
            "unit": "Litre",
            "mrp": "50.00",
            "selling_price": "45.00",
            "manufacturing_date": "2026-01-01",
            "expiry_date": "2026-12-31",
            "minimum_stock": 10,
            "status": Product.Status.ACTIVE,
        }

    def test_create_product_returns_standard_response(self):
        response = self.client.post(
            "/api/v1/products/",
            self.product_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["message"], "Product created successfully.")
        self.assertEqual(response.data["data"]["product_name"], self.product_payload["product_name"])
        self.assertEqual(Product.objects.count(), 1)

    def test_list_products_returns_only_current_business_products(self):
        Product.objects.create(business=self.business, **self.product_payload)

        response = self.client.get("/api/v1/products/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["product_name"], self.product_payload["product_name"])

    def test_get_product_returns_product_details(self):
        product = Product.objects.create(business=self.business, **self.product_payload)

        response = self.client.get(f"/api/v1/products/{product.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["data"]["id"], product.id)
        self.assertEqual(response.data["data"]["product_name"], product.product_name)

    def test_update_product_changes_product_details(self):
        product = Product.objects.create(business=self.business, **self.product_payload)

        updated_payload = {
            "category": self.category.id,
            "supplier": self.supplier.id,
            "barcode": "999999999",
            "product_name": "Bread",
            "brand": "Bakery House",
            "unit": "Packet",
            "mrp": "80.00",
            "selling_price": "70.00",
            "manufacturing_date": "2026-02-01",
            "expiry_date": "2026-10-31",
            "minimum_stock": 15,
            "status": Product.Status.INACTIVE,
        }

        response = self.client.put(
            f"/api/v1/products/{product.id}/",
            updated_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["message"], "Product updated successfully.")
        self.assertEqual(response.data["data"]["product_name"], updated_payload["product_name"])

        product.refresh_from_db()
        self.assertEqual(product.product_name, updated_payload["product_name"])
        self.assertEqual(product.status, updated_payload["status"])

    def test_create_product_with_empty_product_name_returns_validation_error(self):
        invalid_payload = dict(self.product_payload)
        invalid_payload["product_name"] = ""

        response = self.client.post(
            "/api/v1/products/",
            invalid_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["status"])
        self.assertIn("product_name", response.data["errors"])

    def test_get_product_for_missing_id_returns_not_found(self):
        response = self.client.get("/api/v1/products/999999/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_product_removes_product(self):
        product = Product.objects.create(business=self.business, **self.product_payload)

        response = self.client.delete(f"/api/v1/products/{product.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["message"], "Product deleted successfully.")
        self.assertEqual(Product.objects.count(), 0)

    def test_unauthenticated_user_cannot_access_products(self):
        self.client.force_authenticate(user=None)

        response = self.client.get("/api/v1/products/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
