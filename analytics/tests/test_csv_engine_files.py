from __future__ import annotations

from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from analytics.csv_engine import CsvEngine, CsvReportType


class CsvEngineFileTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = CsvEngine()
        self.temporary_directory = TemporaryDirectory()
        self.directory = Path(self.temporary_directory.name)

    def tearDown(self) -> None:
        self.temporary_directory.cleanup()

    def write_file(self, name: str, contents: str) -> Path:
        path = self.directory / name
        path.write_text(contents, encoding="utf-8")
        return path

    def test_wrong_file_extension_is_rejected(self) -> None:
        result = self.engine.process_path(CsvReportType.SALES, self.write_file("sales.txt", "content"))
        self.assertFalse(result.report.is_valid)
        self.assertEqual(result.report.errors[0].code, "invalid_file_type")
        self.assertEqual(result.records, [])

    def test_empty_file_is_rejected(self) -> None:
        result = self.engine.process_path(CsvReportType.SALES, self.write_file("empty.csv", ""))
        self.assertFalse(result.report.is_valid)
        self.assertEqual(result.report.errors[0].code, "empty_file")

    def test_duplicate_header_is_rejected_before_pandas_can_rename_it(self) -> None:
        result = self.engine.process_path(
            CsvReportType.SALES,
            self.write_file("duplicate_header.csv", "invoice_number,barcode,barcode\nINV-1,001,001\n"),
        )
        self.assertFalse(result.report.is_valid)
        self.assertEqual(result.report.errors[0].code, "duplicate_columns")

    def test_path_processing_preserves_leading_zero_barcodes(self) -> None:
        result = self.engine.process_path(
            CsvReportType.SALES,
            self.write_file(
                "sales.csv",
                "invoice_number,barcode,sale_date,quantity_sold,selling_price,discount,total_amount\n"
                "INV-1,0012345,2026-08-01,1,25.00,0,25.00\n",
            ),
        )
        self.assertTrue(result.report.is_valid)
        self.assertEqual(result.records[0]["barcode"], "0012345")

    def test_invalid_file_never_exposes_partial_records(self) -> None:
        result = self.engine.process_path(
            CsvReportType.SALES,
            self.write_file(
                "invalid_sales.csv",
                "invoice_number,barcode,sale_date,quantity_sold,selling_price,discount,total_amount\n"
                "INV-1,001,2026-08-01,1,10,0,10\n"
                "INV-2,002,not-a-date,2,15,0,30\n",
            ),
        )
        self.assertFalse(result.report.is_valid)
        self.assertEqual(result.records, [])
