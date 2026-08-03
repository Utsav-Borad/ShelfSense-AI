# CSV Engine handoff for the Django team

The Analytics CSV Engine has one responsibility: validate and clean POS-export
CSV data. Django remains the controller and the only component allowed to write
to SQLite.

## Supported upload contract

| Endpoint | Report type | Required columns |
| --- | --- | --- |
| `/api/v1/upload/sales/` | `sales` | `invoice_number`, `barcode`, `sale_date`, `quantity_sold`, `selling_price`, `discount`, `total_amount` |
| `/api/v1/upload/inventory/` | `inventory` | `barcode`, `product_name`, `available_quantity`, `reserved_quantity`, `damaged_quantity` |
| `/api/v1/upload/purchase/` | `purchase` | `invoice_number`, `barcode`, `product_name`, `supplier_name`, `purchase_date`, `purchase_price`, `quantity`, `batch_number`, `expiry_date` |

The header names are canonical and case-sensitive. `barcode` is always treated
as text so leading zeroes are preserved.

## Django processing rule

1. Authenticate the owner and accept only a `.csv` upload.
2. Save the uploaded file to temporary protected storage.
3. Call `CsvEngine().process_path(report_type, temporary_path)`.
4. If `result.report.is_valid` is false, delete the temporary file and return
   the report errors. Do not create or update any database record.
5. If valid, pass `result.records` to the matching synchronization service
   inside a single `transaction.atomic()` block.
6. Commit only after every record has synchronized successfully. Otherwise roll
   back the complete upload and return a synchronization error.
7. Delete the temporary upload and trigger analytics only after the transaction
   commits successfully.

This preserves the documented rule: no partial synchronization.

## Validation response

`result.report.as_dict()` returns a response-ready payload:

```json
{
  "valid": false,
  "source_rows": 2,
  "accepted_rows": 0,
  "errors": [
    {
      "code": "invalid_dates",
      "message": "Column 'sale_date' contains invalid dates.",
      "column": "sale_date",
      "rows": [3]
    }
  ]
}
```

Map this to the project API envelope:

```json
{
  "status": false,
  "message": "Validation Error",
  "errors": { "upload": "<validation report>" }
}
```

For a successful synchronization, return the same standard API envelope with a
report containing the source and accepted row counts. Do not report accepted
rows unless the database transaction has committed.
