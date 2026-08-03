# ShelfSense AI Analytics

This folder is owned by the Analytics team. Its CSV Engine is the first stage
of the documented data flow:

`CSV upload -> validation -> cleaning -> Django synchronization -> analytics -> AI`

The engine validates and normalizes CSV data only. It deliberately does not
access Django models or SQLite; the Django CSV upload service remains
responsible for the atomic database synchronization.

## Supported report types

| Report | Required columns |
| --- | --- |
| Sales | `invoice_number`, `barcode`, `sale_date`, `quantity_sold`, `selling_price`, `discount`, `total_amount` |
| Inventory | `barcode`, `product_name`, `available_quantity`, `reserved_quantity`, `damaged_quantity` |
| Purchase | `invoice_number`, `barcode`, `product_name`, `supplier_name`, `purchase_date`, `purchase_price`, `quantity`, `batch_number`, `expiry_date` |

Headers must use these canonical names. The sample templates in
`datasets/templates/` are the supported POS-export format.

## Django integration contract

Call `CsvEngine.process_path(report_type, uploaded_file_path)` after Django has
stored the upload temporarily. If `result.report.is_valid` is false, return
the validation errors and do not write anything to the database. If valid,
pass `result.records` to one `transaction.atomic()` synchronization service.

```python
from analytics.csv_engine import CsvEngine, CsvReportType

result = CsvEngine().process_path(CsvReportType.SALES, temporary_file_path)
if not result.report.is_valid:
    return result.report.as_dict()

# Django owns the following atomic synchronization step.
synchronize_sales(result.records, business=business)
```

## Tests

```powershell
python -m unittest discover -s analytics/tests -v
```
