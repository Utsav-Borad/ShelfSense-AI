from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from business.models import Business

from .models import Category


class CategoryAPITestCase(TestCase):
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

        self.category_payload = {
            "category_name": "Groceries",
            "description": "Daily grocery items",
        }

    def test_create_category_returns_standard_response(self):
        response = self.client.post(
            "/api/v1/categories/",
            self.category_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["message"], "Category created successfully.")
        self.assertEqual(response.data["data"]["category_name"], self.category_payload["category_name"])
        self.assertEqual(Category.objects.count(), 1)

    def test_list_categories_returns_only_current_business_categories(self):
        Category.objects.create(business=self.business, **self.category_payload)

        response = self.client.get("/api/v1/categories/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["category_name"], self.category_payload["category_name"])

    def test_get_category_returns_category_details(self):
        category = Category.objects.create(business=self.business, **self.category_payload)

        response = self.client.get(f"/api/v1/categories/{category.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["data"]["id"], category.id)
        self.assertEqual(response.data["data"]["category_name"], category.category_name)

    def test_update_category_changes_category_details(self):
        category = Category.objects.create(business=self.business, **self.category_payload)

        updated_payload = {
            "category_name": "Household",
            "description": "Home needs",
        }

        response = self.client.put(
            f"/api/v1/categories/{category.id}/",
            updated_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["message"], "Category updated successfully.")
        self.assertEqual(response.data["data"]["category_name"], updated_payload["category_name"])

        category.refresh_from_db()
        self.assertEqual(category.category_name, updated_payload["category_name"])
        self.assertEqual(category.description, updated_payload["description"])

    def test_create_category_with_empty_category_name_returns_validation_error(self):
        invalid_payload = dict(self.category_payload)
        invalid_payload["category_name"] = ""

        response = self.client.post(
            "/api/v1/categories/",
            invalid_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["status"])
        self.assertIn("category_name", response.data["errors"])

    def test_get_category_for_missing_id_returns_not_found(self):
        response = self.client.get("/api/v1/categories/999999/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_category_removes_category(self):
        category = Category.objects.create(business=self.business, **self.category_payload)

        response = self.client.delete(f"/api/v1/categories/{category.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["message"], "Category deleted successfully.")
        self.assertEqual(Category.objects.count(), 0)

    def test_unauthenticated_user_cannot_access_categories(self):
        self.client.force_authenticate(user=None)

        response = self.client.get("/api/v1/categories/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
