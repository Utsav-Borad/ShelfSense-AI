from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from business.models import Business

from .models import Supplier


class SupplierAPITestCase(TestCase):
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

        self.supplier_payload = {
            "supplier_name": "ABC Traders",
            "phone": "9000000000",
            "email": "abc@example.com",
            "address": "45 Supply Road",
            "status": Supplier.Status.ACTIVE,
        }

    def test_create_supplier_returns_standard_response(self):
        response = self.client.post(
            "/api/v1/suppliers/",
            self.supplier_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["message"], "Supplier created successfully.")
        self.assertEqual(response.data["data"]["supplier_name"], self.supplier_payload["supplier_name"])
        self.assertEqual(Supplier.objects.count(), 1)

    def test_list_suppliers_returns_only_current_business_suppliers(self):
        Supplier.objects.create(business=self.business, **self.supplier_payload)

        response = self.client.get("/api/v1/suppliers/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["supplier_name"], self.supplier_payload["supplier_name"])

    def test_get_supplier_returns_supplier_details(self):
        supplier = Supplier.objects.create(business=self.business, **self.supplier_payload)

        response = self.client.get(f"/api/v1/suppliers/{supplier.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["data"]["id"], supplier.id)
        self.assertEqual(response.data["data"]["supplier_name"], supplier.supplier_name)

    def test_update_supplier_changes_supplier_details(self):
        supplier = Supplier.objects.create(business=self.business, **self.supplier_payload)

        updated_payload = {
            "supplier_name": "XYZ Traders",
            "phone": "9111111111",
            "email": "xyz@example.com",
            "address": "77 New Street",
            "status": Supplier.Status.INACTIVE,
        }

        response = self.client.put(
            f"/api/v1/suppliers/{supplier.id}/",
            updated_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["message"], "Supplier updated successfully.")
        self.assertEqual(response.data["data"]["supplier_name"], updated_payload["supplier_name"])

        supplier.refresh_from_db()
        self.assertEqual(supplier.supplier_name, updated_payload["supplier_name"])
        self.assertEqual(supplier.status, updated_payload["status"])

    def test_create_supplier_with_empty_supplier_name_returns_validation_error(self):
        invalid_payload = dict(self.supplier_payload)
        invalid_payload["supplier_name"] = ""

        response = self.client.post(
            "/api/v1/suppliers/",
            invalid_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["status"])
        self.assertIn("supplier_name", response.data["errors"])

    def test_get_supplier_for_missing_id_returns_not_found(self):
        response = self.client.get("/api/v1/suppliers/999999/")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_supplier_removes_supplier(self):
        supplier = Supplier.objects.create(business=self.business, **self.supplier_payload)

        response = self.client.delete(f"/api/v1/suppliers/{supplier.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["message"], "Supplier deleted successfully.")
        self.assertEqual(Supplier.objects.count(), 0)

    def test_unauthenticated_user_cannot_access_suppliers(self):
        self.client.force_authenticate(user=None)

        response = self.client.get("/api/v1/suppliers/")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
