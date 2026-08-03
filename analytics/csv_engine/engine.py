"""Public CSV Engine API. This module never accesses the database."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import pandas as pd

from .cleaning import clean_dataframe
from .schemas import CsvReportType, SCHEMAS
from .validation import ValidationError, ValidationReport, validate_dataframe


@dataclass(frozen=True)
class ProcessedCsv:
    report: ValidationReport
    dataframe: pd.DataFrame | None

    @property
    def records(self) -> list[dict[str, object]]:
        """Typed records for Django's atomic synchronization service."""
        if self.dataframe is None:
            return []
        return self.dataframe.where(pd.notna(self.dataframe), None).to_dict(orient="records")


class CsvEngine:
    """Validate and clean Sales, Inventory, and Purchase POS exports."""

    def process_path(self, report_type: CsvReportType | str, source_path: str | Path) -> ProcessedCsv:
        path = Path(source_path)
        if path.suffix.lower() != ".csv":
            report = ValidationReport(0, [ValidationError("invalid_file_type", "Only .csv files are accepted.")])
            return ProcessedCsv(report, None)
        try:
            dataframe = pd.read_csv(path, dtype="string", keep_default_na=False)
        except (OSError, UnicodeDecodeError, pd.errors.EmptyDataError, pd.errors.ParserError) as error:
            report = ValidationReport(0, [ValidationError("invalid_csv", f"CSV could not be read: {error}")])
            return ProcessedCsv(report, None)
        return self.process_dataframe(report_type, dataframe)

    def process_dataframe(self, report_type: CsvReportType | str, dataframe: pd.DataFrame) -> ProcessedCsv:
        try:
            normalized_type = CsvReportType(report_type)
        except ValueError:
            report = ValidationReport(len(dataframe), [ValidationError("unsupported_report_type", f"Unsupported report type: {report_type}.")])
            return ProcessedCsv(report, None)
        schema = SCHEMAS[normalized_type]
        report = validate_dataframe(dataframe, schema)
        return ProcessedCsv(report, clean_dataframe(dataframe, schema) if report.is_valid else None)
