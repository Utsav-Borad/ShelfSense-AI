"""Validate and import an uploaded CSV.

This is the HTTP counterpart to the `import_*` management commands. It applies
the same rules those commands do — match on id, update in place, never delete —
but it also validates before writing anything, so a bad file is rejected whole
rather than half-applied.

Every row is checked against the caller's own business: an upload can only
touch products that the uploader owns.
"""

import csv
import io
from decimal import Decimal, InvalidOperation

from django.db import transaction

from inventory.models import Inventory
from products.models import Product
from sales.models import Sales

MAX_UPLOAD_BYTES = 5 * 1024 * 1024
MAX_ROWS = 50000

# The columns each upload type requires, in the order the exports produce them.
REQUIRED_COLUMNS = {
    "inventory": ("id", "product_id", "available_quantity", "reserved_quantity", "damaged_quantity"),
    "sales": ("id", "product_id", "invoice_number", "sale_date", "quantity_sold", "selling_price", "discount", "total_amount"),
    "purchase": ("id", "product_id", "available_quantity", "reserved_quantity", "damaged_quantity"),
}


class UploadError(Exception):
    """A problem with the file itself, reported back as a 400."""


def _decode(uploaded_file):
    """Read the upload as UTF-8 text, rejecting anything oversized."""
    if uploaded_file.size > MAX_UPLOAD_BYTES:
        raise UploadError(
            f"The file is larger than {MAX_UPLOAD_BYTES // (1024 * 1024)} MB."
        )
    raw = uploaded_file.read()
    for encoding in ("utf-8-sig", "utf-8", "latin-1"):
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            continue
    raise UploadError("The file could not be read as text. Save it as CSV UTF-8.")


def _as_int(row, column, line):
    try:
        return int(str(row[column]).strip())
    except (TypeError, ValueError) as error:
        raise UploadError(f"Row {line}: '{column}' must be a whole number.") from error


def _as_decimal(row, column, line):
    try:
        return Decimal(str(row[column]).strip())
    except (TypeError, InvalidOperation) as error:
        raise UploadError(f"Row {line}: '{column}' must be a number.") from error


def read_rows(uploaded_file, upload_type):
    """Parse and validate the file's shape. Returns the rows, unwritten."""
    if upload_type not in REQUIRED_COLUMNS:
        raise UploadError(f"Unknown upload type '{upload_type}'.")

    if not uploaded_file.name.lower().endswith(".csv"):
        raise UploadError("Only .csv files can be uploaded.")

    reader = csv.DictReader(io.StringIO(_decode(uploaded_file)))
    if reader.fieldnames is None:
        raise UploadError("The file is empty.")

    present = {name.strip() for name in reader.fieldnames}
    missing = [column for column in REQUIRED_COLUMNS[upload_type] if column not in present]
    if missing:
        raise UploadError(f"Missing required column(s): {', '.join(missing)}.")

    rows = list(reader)
    if not rows:
        raise UploadError("The file has a header but no rows.")
    if len(rows) > MAX_ROWS:
        raise UploadError(f"The file has more than {MAX_ROWS} rows.")
    return rows


def _owned_product_ids(business):
    return set(Product.objects.filter(business=business).values_list("id", flat=True))


@transaction.atomic
def import_inventory(rows, business):
    """Update stock levels. Rows are matched on id and updated in place."""
    owned = _owned_product_ids(business)
    created = updated = skipped = 0

    for index, row in enumerate(rows, start=2):
        product_id = _as_int(row, "product_id", index)
        if product_id not in owned:
            skipped += 1
            continue

        _, was_created = Inventory.objects.update_or_create(
            id=_as_int(row, "id", index),
            defaults={
                "product_id": product_id,
                "available_quantity": _as_int(row, "available_quantity", index),
                "reserved_quantity": _as_int(row, "reserved_quantity", index),
                "damaged_quantity": _as_int(row, "damaged_quantity", index),
            },
        )
        created += int(was_created)
        updated += int(not was_created)

    return {"created": created, "updated": updated, "skipped": skipped}


@transaction.atomic
def import_sales(rows, business):
    """Add or update sales records."""
    owned = _owned_product_ids(business)
    created = updated = skipped = 0

    for index, row in enumerate(rows, start=2):
        product_id = _as_int(row, "product_id", index)
        if product_id not in owned:
            skipped += 1
            continue

        _, was_created = Sales.objects.update_or_create(
            id=_as_int(row, "id", index),
            defaults={
                "product_id": product_id,
                "invoice_number": str(row["invoice_number"]).strip(),
                "sale_date": str(row["sale_date"]).strip(),
                "quantity_sold": _as_int(row, "quantity_sold", index),
                "selling_price": _as_decimal(row, "selling_price", index),
                "discount": _as_decimal(row, "discount", index),
                "total_amount": _as_decimal(row, "total_amount", index),
            },
        )
        created += int(was_created)
        updated += int(not was_created)

    return {"created": created, "updated": updated, "skipped": skipped}


# A purchase report restocks the shelf, so it lands in the same Inventory table.
IMPORTERS = {
    "inventory": import_inventory,
    "sales": import_sales,
    "purchase": import_inventory,
}
