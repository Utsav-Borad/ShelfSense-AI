// CSV Synchronization Center — shared model.
// No parsing happens anywhere here: we only read a File's name, size and type.

// The three canonical report formats, with the exact column headers the
// analytics engine expects (datasets/templates/).
export const REPORT_TYPES = [
  {
    id: 'sales', label: 'Sales report', file: 'sales_report.csv', icon: 'bi-receipt',
    hint: 'Every line item your POS billed.',
    columns: ['invoice_number', 'barcode', 'sale_date', 'quantity_sold', 'selling_price', 'discount', 'total_amount'],
  },
  {
    id: 'inventory', label: 'Inventory snapshot', file: 'inventory_report.csv', icon: 'bi-boxes',
    hint: 'What is on the shelf right now.',
    columns: ['barcode', 'product_name', 'available_quantity', 'reserved_quantity', 'damaged_quantity'],
  },
  {
    id: 'purchase', label: 'Purchase history', file: 'purchase_report.csv', icon: 'bi-bag-check',
    hint: 'What you bought, from whom, and when it expires.',
    columns: ['invoice_number', 'barcode', 'product_name', 'supplier_name', 'purchase_date', 'purchase_price', 'quantity', 'batch_number', 'expiry_date'],
  },
];

// The guided flow across the top of the page.
export const FLOW_STEPS = [
  { id: 'sales', label: 'Sales CSV' },
  { id: 'inventory', label: 'Inventory CSV' },
  { id: 'purchase', label: 'Purchase CSV' },
  { id: 'validate', label: 'Validate' },
  { id: 'sync', label: 'Synchronize' },
  { id: 'complete', label: 'Complete' },
];

// The synchronization timeline. `work` is the active period, `settle` is the
// short pause where the stage plays its success animation before the next one
// starts. Durations are what make the run feel deliberate rather than instant.
export const SYNC_STAGES = [
  { id: 'upload', label: 'CSV Uploaded', icon: 'bi-cloud-arrow-up', work: 2600, settle: 700, detail: 'Transferring your three reports.' },
  { id: 'validation', label: 'Validation', icon: 'bi-shield-check', work: 3000, settle: 700, detail: 'Columns, types, dates and duplicates.' },
  { id: 'database', label: 'Database Sync', icon: 'bi-database', work: 4200, settle: 700, detail: 'One transaction. All rows, or none.' },
  { id: 'analytics', label: 'Analytics', icon: 'bi-pie-chart', work: 3600, settle: 700, detail: 'Recomputing ten business metrics.' },
  { id: 'ai', label: 'AI Processing', icon: 'bi-cpu', work: 4200, settle: 700, detail: 'Six models reading the new position.' },
  { id: 'complete', label: 'Completed', icon: 'bi-check2-circle', work: 900, settle: 0, detail: 'Your workspace is up to date.' },
];

export const TOTAL_SYNC_MS = SYNC_STAGES.reduce((sum, stage) => sum + stage.work + stage.settle, 0);

// Status line for the stage that is currently running.
export function statusMessage(stageIndex, stageProgress, fileNames) {
  if (stageIndex === 0) {
    // The upload stage walks through the three files as it progresses.
    const which = Math.min(Math.floor(stageProgress * 3), 2);
    return `Uploading ${fileNames[which] || REPORT_TYPES[which].file}…`;
  }
  return [
    '',
    'Validating file structure…',
    'Synchronizing database…',
    'Running analytics…',
    'AI generating recommendations…',
    'Business Intelligence Ready.',
  ][stageIndex];
}

// Works out which stage we are in from a single elapsed value, so every part
// of the timeline reads from one clock and nothing can drift out of step.
export function deriveSync(elapsed) {
  let start = 0;
  for (let index = 0; index < SYNC_STAGES.length; index += 1) {
    const stage = SYNC_STAGES[index];
    if (elapsed < start + stage.work) {
      return { index, phase: 'working', stageProgress: (elapsed - start) / stage.work };
    }
    if (elapsed < start + stage.work + stage.settle) {
      return { index, phase: 'settling', stageProgress: 1 };
    }
    start += stage.work + stage.settle;
  }
  return { index: SYNC_STAGES.length - 1, phase: 'done', stageProgress: 1 };
}

export function formatBytes(bytes) {
  if (!bytes) return '0 KB';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// PLACEHOLDER validation. Nothing is parsed — the outcome is decided by the
// file name so all three states can be demonstrated:
//   name contains "invalid" or "error" -> failed
//   name contains "warn"               -> passed with warnings
//   anything else                      -> clean
// The shape mirrors the real engine's report (analytics/docs/csv_engine_handoff.md).
export function validateFile(reportType, file) {
  const name = (file?.name || '').toLowerCase();
  const sourceRows = 60 + ((file?.size || 4200) % 180);

  if (name.includes('invalid') || name.includes('error')) {
    const failures = {
      sales: { code: 'invalid_dates', message: "Column 'sale_date' contains invalid dates.", column: 'sale_date', rows: [3, 41] },
      inventory: { code: 'negative_quantity', message: "Column 'available_quantity' cannot be negative.", column: 'available_quantity', rows: [12] },
      purchase: { code: 'missing_values', message: "Column 'supplier_name' has empty values.", column: 'supplier_name', rows: [7, 19, 20] },
    };
    return { valid: false, level: 'error', source_rows: sourceRows, accepted_rows: 0, errors: [failures[reportType]] };
  }

  if (name.includes('warn')) {
    return {
      valid: true, level: 'warning', source_rows: sourceRows, accepted_rows: sourceRows,
      errors: [],
      warnings: [{ code: 'trailing_whitespace', message: 'Trailing spaces were trimmed automatically.', column: 'product_name', rows: [5, 6] }],
    };
  }

  return { valid: true, level: 'success', source_rows: sourceRows, accepted_rows: sourceRows, errors: [], warnings: [] };
}

// Placeholder history rows.
export const HISTORY_ROWS = [
  { id: 'SYN-1042', date: '2026-08-04 09:12', types: ['sales', 'inventory', 'purchase'], rows: 412, accepted: 412, status: 'success', duration: '24s' },
  { id: 'SYN-1041', date: '2026-08-03 09:08', types: ['sales', 'inventory', 'purchase'], rows: 398, accepted: 395, status: 'warning', duration: '26s' },
  { id: 'SYN-1040', date: '2026-08-02 09:15', types: ['sales'], rows: 128, accepted: 0, status: 'failed', duration: '4s', reason: "Column 'sale_date' contains invalid dates." },
  { id: 'SYN-1039', date: '2026-08-01 09:04', types: ['sales', 'inventory', 'purchase'], rows: 431, accepted: 431, status: 'success', duration: '23s' },
  { id: 'SYN-1038', date: '2026-07-31 09:11', types: ['inventory', 'purchase'], rows: 260, accepted: 0, status: 'failed', duration: '3s', reason: "Column 'supplier_name' has empty values." },
  { id: 'SYN-1037', date: '2026-07-30 09:07', types: ['sales', 'inventory', 'purchase'], rows: 405, accepted: 405, status: 'success', duration: '25s' },
];
