"""Validate and import an uploaded CSV.

This is the HTTP counterpart to the `import_*` management commands. It validates
before writing anything, so a bad file is rejected whole rather than half
applied, and every write is scoped to the caller's own business.

Two file shapes are accepted, decided per file from its header:

* **catalogue shape** — keyed on `barcode`. Products, suppliers and categories
  the shop has not registered yet are created on the way in, so a brand new
  business can be populated entirely from its own POS exports. These are the
  columns the CSV Sync page lists on screen.

* **id shape** — keyed on the database's own `id` / `product_id` columns. This
  is what `dataset_generator/output/*.csv` contains and what this module
  accepted before. It never creates anything: a row naming a product the
  business does not own is skipped, exactly as it always was.

Nothing is ever deleted, and every lookup is filtered by business, so one
shop's upload can never read or modify another shop's rows.
"""

import csv
import io
from datetime import date
from decimal import Decimal, InvalidOperation

from django.db import transaction

from categories.models import Category
from inventory.models import Inventory
from products.models import Product
from sales.models import Sales
from suppliers.models import Supplier

MAX_UPLOAD_BYTES = 5 * 1024 * 1024
MAX_ROWS = 50000

# Keyed on the database ids. Matches the generated dataset, creates nothing.
ID_COLUMNS = {
    "inventory": ("id", "product_id", "available_quantity", "reserved_quantity", "damaged_quantity"),
    "sales": ("id", "product_id", "invoice_number", "sale_date", "quantity_sold", "selling_price", "discount", "total_amount"),
    "purchase": ("id", "product_id", "available_quantity", "reserved_quantity", "damaged_quantity"),
}

# Keyed on barcode. Matches a real POS export, and may create catalogue rows.
CATALOGUE_COLUMNS = {
    "inventory": ("barcode", "product_name", "available_quantity", "reserved_quantity", "damaged_quantity"),
    "purchase": ("barcode", "product_name", "supplier_name", "quantity"),
    "sales": ("barcode", "sale_date", "quantity_sold", "selling_price", "total_amount"),
}

# Used when a catalogue row has to be created and the file does not say.
DEFAULT_CATEGORY = "Uncategorised"
DEFAULT_SUPPLIER = "Unknown supplier"
DEFAULT_UNIT = "unit"
DEFAULT_MINIMUM_STOCK = 0


class UploadError(Exception):
    """A problem with the file itself, reported back as a 400."""


# ---------------------------------------------------------------------------
# Reading and per-cell parsing
# ---------------------------------------------------------------------------

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


def _text(row, column, default=""):
    """A trimmed string from an optional column."""
    value = row.get(column)
    if value is None:
        return default
    value = str(value).strip()
    return value or default


def _as_int(row, column, line):
    try:
        return int(str(row[column]).strip())
    except (KeyError, TypeError, ValueError) as error:
        raise UploadError(f"Row {line}: '{column}' must be a whole number.") from error


def _as_decimal(row, column, line):
    try:
        return Decimal(str(row[column]).strip())
    except (KeyError, TypeError, InvalidOperation) as error:
        raise UploadError(f"Row {line}: '{column}' must be a number.") from error


def _optional_int(row, column, line, default):
    """Like `_as_int`, but an absent or blank cell falls back to `default`."""
    if not _text(row, column):
        return default
    return _as_int(row, column, line)


def _optional_decimal(row, column, line, default):
    if not _text(row, column):
        return default
    return _as_decimal(row, column, line)


def _as_date(row, column, line, required=True):
    """Parse an ISO date. Blank is allowed only when `required` is False."""
    raw = _text(row, column)
    if not raw:
        if required:
            raise UploadError(f"Row {line}: '{column}' is required.")
        return None
    try:
        return date.fromisoformat(raw[:10])
    except ValueError as error:
        raise UploadError(
            f"Row {line}: '{column}' must be a date in YYYY-MM-DD format."
        ) from error


def _shape_for(present, upload_type):
    """Decide which of the two layouts this file is, from its header."""
    if set(CATALOGUE_COLUMNS[upload_type]).issubset(present):
        return "catalogue"
    if set(ID_COLUMNS[upload_type]).issubset(present):
        return "id"
    return None


def read_rows(uploaded_file, upload_type):
    """Parse and validate the file's shape. Returns the rows, unwritten."""
    if upload_type not in CATALOGUE_COLUMNS:
        raise UploadError(f"Unknown upload type '{upload_type}'.")

    if not uploaded_file.name.lower().endswith(".csv"):
        raise UploadError("Only .csv files can be uploaded.")

    reader = csv.DictReader(io.StringIO(_decode(uploaded_file)))
    if reader.fieldnames is None:
        raise UploadError("The file is empty.")

    present = {name.strip() for name in reader.fieldnames if name}
    if _shape_for(present, upload_type) is None:
        expected = ", ".join(CATALOGUE_COLUMNS[upload_type])
        missing = [c for c in CATALOGUE_COLUMNS[upload_type] if c not in present]
        raise UploadError(
            f"Missing required column(s): {', '.join(missing)}. "
            f"A {upload_type} file needs: {expected}."
        )

    rows = list(reader)
    if not rows:
        raise UploadError("The file has a header but no rows.")
    if len(rows) > MAX_ROWS:
        raise UploadError(f"The file has more than {MAX_ROWS} rows.")

    # Remember which layout was detected so the importer does not re-derive it.
    rows[0]["__shape__"] = _shape_for(present, upload_type)
    return rows


def _shape_of(rows):
    return rows[0].get("__shape__", "id")


# ---------------------------------------------------------------------------
# Catalogue: find an existing row for this business, or create one
# ---------------------------------------------------------------------------

class Catalogue:
    """Resolves names and barcodes to rows, creating them when absent.

    Every lookup is scoped to one business. Existing rows are read once into
    dictionaries keyed by a normalised name, which does two things: it keeps
    repeated rows inside a single file from creating duplicates, and it reuses
    what the business already has instead of adding a second copy of it.

    None of these models carries a unique constraint, so this is the only thing
    preventing duplicates.
    """

    def __init__(self, business):
        self.business = business
        self.created = {"products": 0, "suppliers": 0, "categories": 0}

        self._categories = {
            self._key(row.category_name): row
            for row in Category.objects.filter(business=business)
        }
        self._suppliers = {
            self._key(row.supplier_name): row
            for row in Supplier.objects.filter(business=business)
        }

        # Products are matched on barcode first, falling back to name for rows
        # that were imported without one.
        self._products_by_barcode = {}
        self._products_by_name = {}
        for row in Product.objects.filter(business=business):
            if row.barcode:
                self._products_by_barcode[self._key(row.barcode)] = row
            self._products_by_name.setdefault(self._key(row.product_name), row)

    @staticmethod
    def _key(value):
        return str(value or "").strip().casefold()

    def category(self, name):
        name = str(name or "").strip() or DEFAULT_CATEGORY
        key = self._key(name)
        found = self._categories.get(key)
        if found is not None:
            return found

        # `description` is one of the text features the forecast engine reads;
        # a blank one makes every product in the category unanalysable, so it is
        # always given a value.
        found = Category.objects.create(
            business=self.business,
            category_name=name,
            description=f"{name} products",
        )
        self._categories[key] = found
        self.created["categories"] += 1
        return found

    def supplier(self, name):
        name = str(name or "").strip() or DEFAULT_SUPPLIER
        key = self._key(name)
        found = self._suppliers.get(key)
        if found is not None:
            return found

        # `phone` is NOT NULL on the model with no default, so it is set empty.
        found = Supplier.objects.create(
            business=self.business,
            supplier_name=name,
            phone="",
        )
        self._suppliers[key] = found
        self.created["suppliers"] += 1
        return found

    def find_product(self, barcode, product_name):
        """Return an existing product for this business, or None."""
        if barcode:
            found = self._products_by_barcode.get(self._key(barcode))
            if found is not None:
                return found
        if product_name:
            return self._products_by_name.get(self._key(product_name))
        return None

    def product(self, barcode, product_name, row, line, supplier_name=None):
        """Return the matching product, creating it when the shop has none.

        Only the fields the model requires are set. Anything the file does not
        carry falls back to a documented default rather than being guessed at.
        """
        found = self.find_product(barcode, product_name)
        if found is not None:
            return found

        if not product_name:
            raise UploadError(f"Row {line}: 'product_name' is required to add a new product.")

        selling_price = _optional_decimal(row, "selling_price", line, None)
        mrp = _optional_decimal(row, "mrp", line, None)
        purchase_price = _optional_decimal(row, "purchase_price", line, None)

        # Whichever price the file happens to carry stands in for the others,
        # so a product is never created with a price of zero by accident.
        if selling_price is None:
            selling_price = mrp if mrp is not None else purchase_price
        if mrp is None:
            mrp = selling_price
        if selling_price is None:
            selling_price = mrp = Decimal("0")

        created = Product.objects.create(
            business=self.business,
            category=self.category(_text(row, "category_name")),
            supplier=self.supplier(supplier_name or _text(row, "supplier_name")),
            barcode=str(barcode).strip() or None,
            product_name=product_name,
            brand=_text(row, "brand") or None,
            unit=_text(row, "unit", DEFAULT_UNIT),
            mrp=mrp,
            selling_price=selling_price,
            expiry_date=_as_date(row, "expiry_date", line, required=False),
            minimum_stock=_optional_int(row, "minimum_stock", line, DEFAULT_MINIMUM_STOCK),
        )

        if created.barcode:
            self._products_by_barcode[self._key(created.barcode)] = created
        self._products_by_name.setdefault(self._key(created.product_name), created)
        self.created["products"] += 1
        return created


def _owned_product_ids(business):
    return set(Product.objects.filter(business=business).values_list("id", flat=True))


def _result(created=0, updated=0, skipped=0, catalogue=None, **extra):
    """The counters the API reports back, in one consistent shape."""
    payload = {"created": created, "updated": updated, "skipped": skipped}
    if catalogue is not None:
        payload["products_created"] = catalogue.created["products"]
        payload["suppliers_created"] = catalogue.created["suppliers"]
        payload["categories_created"] = catalogue.created["categories"]
    payload.update(extra)
    return payload


# ---------------------------------------------------------------------------
# Inventory
# ---------------------------------------------------------------------------

@transaction.atomic
def import_inventory(rows, business):
    """Update stock levels from an inventory snapshot."""
    if _shape_of(rows) == "catalogue":
        return _import_inventory_by_barcode(rows, business)
    return _import_inventory_by_id(rows, business)


def _import_inventory_by_id(rows, business):
    """Unchanged behaviour: match on the file's own ids, create nothing."""
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

    return _result(created, updated, skipped)


def _import_inventory_by_barcode(rows, business):
    """A snapshot of what is on the shelf. Sets quantities to what the file says.

    Products the business has not registered are created, so an inventory
    export alone is enough to populate a new shop.
    """
    catalogue = Catalogue(business)
    created = updated = 0

    for index, row in enumerate(rows, start=2):
        product = catalogue.product(
            _text(row, "barcode"),
            _text(row, "product_name"),
            row,
            index,
        )

        # Inventory.product is a OneToOneField, so the product is the key.
        _, was_created = Inventory.objects.update_or_create(
            product=product,
            defaults={
                "available_quantity": _as_int(row, "available_quantity", index),
                "reserved_quantity": _optional_int(row, "reserved_quantity", index, 0),
                "damaged_quantity": _optional_int(row, "damaged_quantity", index, 0),
            },
        )
        created += int(was_created)
        updated += int(not was_created)

    return _result(created, updated, 0, catalogue)


# ---------------------------------------------------------------------------
# Purchases
# ---------------------------------------------------------------------------

@transaction.atomic
def import_purchase(rows, business):
    """A purchase report: what was bought, from whom.

    This is the only file that names a supplier, so it is the only one that can
    create one. Purchased quantities are added to the shelf, because a purchase
    is a delivery rather than a snapshot — re-uploading the same file will
    therefore add the same stock twice.
    """
    if _shape_of(rows) != "catalogue":
        # An id-shaped purchase file is an inventory snapshot by another name,
        # which is how this endpoint behaved before.
        return _import_inventory_by_id(rows, business)

    catalogue = Catalogue(business)
    created = updated = 0
    stock_added = 0

    for index, row in enumerate(rows, start=2):
        quantity = _as_int(row, "quantity", index)
        if quantity < 0:
            raise UploadError(f"Row {index}: 'quantity' cannot be negative.")

        product = catalogue.product(
            _text(row, "barcode"),
            _text(row, "product_name"),
            row,
            index,
            supplier_name=_text(row, "supplier_name"),
        )

        stock, was_created = Inventory.objects.get_or_create(product=product)
        stock.available_quantity = stock.available_quantity + quantity
        stock.save(update_fields=["available_quantity", "last_updated"])

        created += int(was_created)
        updated += int(not was_created)
        stock_added += quantity

    return _result(created, updated, 0, catalogue, stock_added=stock_added)


# ---------------------------------------------------------------------------
# Sales
# ---------------------------------------------------------------------------

@transaction.atomic
def import_sales(rows, business):
    """Add or update sales records."""
    if _shape_of(rows) == "catalogue":
        return _import_sales_by_barcode(rows, business)
    return _import_sales_by_id(rows, business)


def _import_sales_by_id(rows, business):
    """Unchanged behaviour: match on the file's own ids, create nothing."""
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

    return _result(created, updated, skipped)


def _import_sales_by_barcode(rows, business):
    """Sales never create products.

    A sale of a barcode the shop does not stock is a data problem, not a new
    product: there is no supplier or cost behind it, and one mistyped barcode
    would otherwise add a permanent catalogue entry. Those rows are skipped and
    counted, so the response says how many were ignored.
    """
    catalogue = Catalogue(business)
    created = updated = skipped = 0

    for index, row in enumerate(rows, start=2):
        product = catalogue.find_product(
            _text(row, "barcode"),
            _text(row, "product_name"),
        )
        if product is None:
            skipped += 1
            continue

        # Sales has no unique constraint, so the natural key is what identifies
        # one line: the same invoice, product and date is the same sale.
        _, was_created = Sales.objects.update_or_create(
            product=product,
            invoice_number=_text(row, "invoice_number"),
            sale_date=_as_date(row, "sale_date", index),
            defaults={
                "quantity_sold": _as_int(row, "quantity_sold", index),
                "selling_price": _as_decimal(row, "selling_price", index),
                "discount": _optional_decimal(row, "discount", index, Decimal("0")),
                "total_amount": _as_decimal(row, "total_amount", index),
            },
        )
        created += int(was_created)
        updated += int(not was_created)

    return _result(created, updated, skipped)


IMPORTERS = {
    "inventory": import_inventory,
    "sales": import_sales,
    "purchase": import_purchase,
}
