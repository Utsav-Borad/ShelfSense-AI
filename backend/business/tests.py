from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from .models import Business


class BusinessAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.user = get_user_model().objects.create_user(
            full_name="Test Owner",
            email="owner@example.com",
            password="strong-password-123",
        )

        self.client.force_authenticate(user=self.user)

        self.business_payload = {
            "shop_name": "ShelfSense Mart",
            "shop_type": "Grocery",
            "address": "12 Market Street",
            "phone": "9876543210",
            "gst_number": "GST1234567",
        }

    # ------------------------------------------------------------
    # CREATE BUSINESS
    # ------------------------------------------------------------

    def test_create_business_returns_standard_response(self):
        response = self.client.post(
            "/api/v1/business/",
            self.business_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["status"])
        self.assertEqual(
            response.data["message"],
            "Business created successfully.",
        )
        self.assertEqual(
            response.data["data"]["shop_name"],
            self.business_payload["shop_name"],
        )
        self.assertEqual(
            response.data["data"]["owner"],
            self.user.id,
        )
        self.assertEqual(Business.objects.count(), 1)

    # ------------------------------------------------------------
    # GET BUSINESS
    # ------------------------------------------------------------

    def test_get_business_returns_current_owners_business(self):
        business = Business.objects.create(
            owner=self.user,
            **self.business_payload,
        )

        response = self.client.get("/api/v1/business/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(response.data["message"], "Success")
        self.assertEqual(response.data["data"]["id"], business.id)
        self.assertEqual(
            response.data["data"]["shop_name"],
            business.shop_name,
        )

    # ------------------------------------------------------------
    # DUPLICATE BUSINESS
    # ------------------------------------------------------------

    def test_duplicate_business_creation_is_rejected(self):
        Business.objects.create(
            owner=self.user,
            **self.business_payload,
        )

        response = self.client.post(
            "/api/v1/business/",
            self.business_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["status"])
        self.assertEqual(response.data["message"], "Validation Error")
        self.assertIn("business", response.data["errors"])

    # ------------------------------------------------------------
    # UPDATE BUSINESS
    # ------------------------------------------------------------

    def test_update_business_changes_business_details(self):
        business = Business.objects.create(
            owner=self.user,
            **self.business_payload,
        )

        updated_payload = {
            "shop_name": "ShelfSense Supermart",
            "shop_type": "Grocery",
            "address": "45 Commerce Road",
            "phone": "9999999999",
            "gst_number": "GST1234567",
        }

        response = self.client.put(
            f"/api/v1/business/{business.id}/",
            updated_payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["status"])
        self.assertEqual(
            response.data["message"],
            "Business updated successfully.",
        )
        self.assertEqual(
            response.data["data"]["shop_name"],
            updated_payload["shop_name"],
        )

        business.refresh_from_db()

        self.assertEqual(
            business.shop_name,
            updated_payload["shop_name"],
        )
        self.assertEqual(
            business.address,
            updated_payload["address"],
        )

    # ------------------------------------------------------------
    # AUTHENTICATION
    # ------------------------------------------------------------

    def test_unauthenticated_user_cannot_create_business(self):
        self.client.force_authenticate(user=None)

        response = self.client.post(
            "/api/v1/business/",
            self.business_payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    # ------------------------------------------------------------
    # VALIDATION
    # ------------------------------------------------------------

    def test_create_business_with_invalid_data_returns_validation_error(self):
        invalid_payload = {
            "shop_name": "",
            "shop_type": "",
            "address": "",
            "phone": "",
        }

        response = self.client.post(
            "/api/v1/business/",
            invalid_payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertFalse(response.data["status"])

    # ------------------------------------------------------------
    # BUSINESS NOT FOUND
    # ------------------------------------------------------------

    def test_get_business_when_business_does_not_exist(self):
        response = self.client.get("/api/v1/business/")

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )