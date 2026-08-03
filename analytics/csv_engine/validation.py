"""Validation for POS CSV reports before any database synchronization."""

from __future__ import annotations

from dataclasses import dataclass, field

import pandas as pd

from .schemas import CsvSchema


@dataclass(frozen=True)
class ValidationError:
    code: str
    message: str
    column: str | None = None
    rows: tuple[int, ...] = ()

    def as_dict(self) -> dict[str, object]:
        return {"code": self.code, "message": self.message, "column": self.column, "rows": list(self.rows)}


@dataclass
class ValidationReport:
    source_rows: int
    errors: list[ValidationError] = field(default_factory=list)

    @property
    def is_valid(self) -> bool:
        return not self.errors

    def as_dict(self) -> dict[str, object]:
        return {"valid": self.is_valid, "source_rows": self.source_rows, "accepted_rows": self.source_rows if self.is_valid else 0, "errors": [error.as_dict() for error in self.errors]}


def validate_dataframe(frame: pd.DataFrame, schema: CsvSchema) -> ValidationReport:
    """Validate every documented upload rule without changing input data."""
    report = ValidationReport(source_rows=len(frame))
    normalized_columns = [str(column).strip() for column in frame.columns]
    if len(set(normalized_columns)) != len(normalized_columns):
        report.errors.append(ValidationError("duplicate_columns", "CSV contains duplicate column headers."))
        return report
    missing_columns = sorted(set(schema.required_columns) - set(normalized_columns))
    if missing_columns:
        report.errors.append(ValidationError("missing_columns", f"Missing required columns: {', '.join(missing_columns)}."))
        return report
    if frame.empty:
        report.errors.append(ValidationError("empty_file", "CSV must contain at least one data row."))
        return report

    working = frame.copy()
    working.columns = normalized_columns
    duplicate_rows = working.duplicated(keep=False)
    if duplicate_rows.any():
        report.errors.append(ValidationError("duplicate_rows", "CSV contains duplicate data rows.", rows=_csv_row_numbers(duplicate_rows)))

    for rule in schema.columns:
        values = working[rule.name].astype("string").str.strip()
        missing_values = values.isna() | values.eq("")
        if missing_values.any():
            report.errors.append(ValidationError("missing_values", f"Column '{rule.name}' contains missing values.", rule.name, _csv_row_numbers(missing_values)))
            continue
        if rule.kind == "date":
            invalid_dates = pd.to_datetime(values, errors="coerce").isna()
            if invalid_dates.any():
                report.errors.append(ValidationError("invalid_dates", f"Column '{rule.name}' contains invalid dates.", rule.name, _csv_row_numbers(invalid_dates)))
        if rule.kind == "number":
            parsed_numbers = pd.to_numeric(values, errors="coerce")
            invalid_numbers = parsed_numbers.isna()
            if invalid_numbers.any():
                report.errors.append(ValidationError("invalid_numbers", f"Column '{rule.name}' contains invalid numeric values.", rule.name, _csv_row_numbers(invalid_numbers)))
                continue
            invalid_range = parsed_numbers.le(0) if rule.strictly_positive else parsed_numbers.lt(rule.minimum) if rule.minimum is not None else pd.Series(False, index=working.index)
            if invalid_range.any():
                code = "invalid_quantity" if rule.strictly_positive else "invalid_range"
                report.errors.append(ValidationError(code, f"Column '{rule.name}' contains values outside its allowed range.", rule.name, _csv_row_numbers(invalid_range)))
    return report


def _csv_row_numbers(mask: pd.Series) -> tuple[int, ...]:
    """Convert DataFrame indexes to CSV row numbers; headers occupy row one."""
    return tuple(position + 2 for position, matched in enumerate(mask.tolist()) if matched)
