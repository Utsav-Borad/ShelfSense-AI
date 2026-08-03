from __future__ import annotations

import unittest

import pandas as pd

from analytics.csv_engine import CsvEngine, CsvReportType


class CsvEngineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = CsvEngine()

    def test_valid_sales_csv_is_cleaned_and_ready_for_synchronization(self) -> None:
        dataframe = pd.DataFrame([{
            "invoice_number": " INV-001 ", "barcode": "0012345", "sale_date": "2026-08-01",
            "quantity_sold": "2", "selling_price": "20.50", "discount": "0", "total_amount": "41.00",
        }])
        result = self.engine.process_dataframe(CsvReportType.SALES, dataframe)
        self.assertTrue(result.report.is_valid)
        self.assertEqual(result.records[0]["invoice_number"], "INV-001")
        self.assertEqual(result.records[0]["barcode"], "0012345")
        self.assertEqual(result.records[0]["quantity_sold"], 2)

    def test_missing_required_columns_rejects_entire_upload(self) -> None:
        result = self.engine.process_dataframe(CsvReportType.INVENTORY, pd.DataFrame([{"barcode": "123", "product_name": "Milk"}]))
        self.assertFalse(result.report.is_valid)
        self.assertEqual(result.records, [])
        self.assertEqual(result.report.errors[0].code, "missing_columns")

    def test_invalid_purchase_dates_and_quantities_are_reported(self) -> None:
        dataframe = pd.DataFrame([{
            "invoice_number": "P-1", "barcode": "123", "product_name": "Bread", "supplier_name": "Fresh Foods",
            "purchase_date": "not-a-date", "purchase_price": "-5", "quantity": "0", "batch_number": "B1", "expiry_date": "2026-10-01",
        }])
        result = self.engine.process_dataframe(CsvReportType.PURCHASE, dataframe)
        self.assertFalse(result.report.is_valid)
        self.assertEqual({error.code for error in result.report.errors}, {"invalid_dates", "invalid_range", "invalid_quantity"})

    def test_duplicate_rows_are_rejected(self) -> None:
        row = {"barcode": "123", "product_name": "Milk", "available_quantity": "5", "reserved_quantity": "0", "damaged_quantity": "0"}
        result = self.engine.process_dataframe(CsvReportType.INVENTORY, pd.DataFrame([row, row]))
        self.assertFalse(result.report.is_valid)
        duplicate_error = next(error for error in result.report.errors if error.code == "duplicate_rows")
        self.assertEqual(duplicate_error.rows, (2, 3))
