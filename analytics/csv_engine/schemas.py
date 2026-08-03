"""Canonical CSV schemas shared with the Django synchronization layer."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class CsvReportType(str, Enum):
    """The only POS report types accepted by ShelfSense AI."""

    SALES = "sales"
    INVENTORY = "inventory"
    PURCHASE = "purchase"


@dataclass(frozen=True)
class ColumnRule:
    name: str
    kind: str = "text"
    minimum: float | None = None
    strictly_positive: bool = False


@dataclass(frozen=True)
class CsvSchema:
    report_type: CsvReportType
    columns: tuple[ColumnRule, ...]

    @property
    def required_columns(self) -> tuple[str, ...]:
        return tuple(column.name for column in self.columns)


SALES_SCHEMA = CsvSchema(
    CsvReportType.SALES,
    (
        ColumnRule("invoice_number"), ColumnRule("barcode"), ColumnRule("sale_date", kind="date"),
        ColumnRule("quantity_sold", kind="number", strictly_positive=True),
        ColumnRule("selling_price", kind="number", minimum=0), ColumnRule("discount", kind="number", minimum=0),
        ColumnRule("total_amount", kind="number", minimum=0),
    ),
)
INVENTORY_SCHEMA = CsvSchema(
    CsvReportType.INVENTORY,
    (
        ColumnRule("barcode"), ColumnRule("product_name"),
        ColumnRule("available_quantity", kind="number", minimum=0),
        ColumnRule("reserved_quantity", kind="number", minimum=0),
        ColumnRule("damaged_quantity", kind="number", minimum=0),
    ),
)
PURCHASE_SCHEMA = CsvSchema(
    CsvReportType.PURCHASE,
    (
        ColumnRule("invoice_number"), ColumnRule("barcode"), ColumnRule("product_name"), ColumnRule("supplier_name"),
        ColumnRule("purchase_date", kind="date"), ColumnRule("purchase_price", kind="number", minimum=0),
        ColumnRule("quantity", kind="number", strictly_positive=True), ColumnRule("batch_number"),
        ColumnRule("expiry_date", kind="date"),
    ),
)
SCHEMAS: dict[CsvReportType, CsvSchema] = {schema.report_type: schema for schema in (SALES_SCHEMA, INVENTORY_SCHEMA, PURCHASE_SCHEMA)}
