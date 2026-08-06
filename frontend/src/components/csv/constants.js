// CSV Synchronization Center — shared model.

// The three canonical report formats, with the column headers shown on screen.
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

// The order the files must be sent in, which is not the order they are shown.
// Sales rows are matched against products that already exist and never create
// them, so the two catalogue files have to land first or every sale is skipped.
// Purchase runs before inventory because purchase *adds* stock while inventory
// *sets* it: this way the snapshot is the final word on what is on the shelf.
export const UPLOAD_ORDER = ['purchase', 'inventory', 'sales'];

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

// The two file layouts the server accepts, per report type. These mirror
// CATALOGUE_COLUMNS and ID_COLUMNS in backend/uploads/services.py exactly — if
// a required column changes there, it has to change here too, or the screen
// will pass a file the server then rejects.
//
//   catalogue : keyed on barcode. Missing products and suppliers are created.
//   id        : keyed on the database ids, as the generated dataset exports.
export const ACCEPTED_SHAPES = {
  sales: {
    catalogue: ['barcode', 'sale_date', 'quantity_sold', 'selling_price', 'total_amount'],
    id: ['id', 'product_id', 'invoice_number', 'sale_date', 'quantity_sold', 'selling_price', 'discount', 'total_amount'],
  },
  inventory: {
    catalogue: ['barcode', 'product_name', 'available_quantity', 'reserved_quantity', 'damaged_quantity'],
    id: ['id', 'product_id', 'available_quantity', 'reserved_quantity', 'damaged_quantity'],
  },
  purchase: {
    catalogue: ['barcode', 'product_name', 'supplier_name', 'quantity'],
    id: ['id', 'product_id', 'available_quantity', 'reserved_quantity', 'damaged_quantity'],
  },
};

const INTEGER_COLUMNS = ['quantity', 'quantity_sold', 'available_quantity', 'reserved_quantity', 'damaged_quantity', 'minimum_stock'];
const DECIMAL_COLUMNS = ['selling_price', 'total_amount', 'discount', 'mrp', 'purchase_price'];
const DATE_COLUMNS = ['sale_date', 'expiry_date', 'purchase_date', 'manufacturing_date'];
const QUANTITY_COLUMNS = ['quantity', 'quantity_sold', 'available_quantity', 'reserved_quantity', 'damaged_quantity'];

const MAX_REPORTED_ROWS = 6;

// A small CSV reader — enough for a header and simple quoted cells. The server
// parses the file properly again; this exists only to fail early.
function parseCsv(text) {
  const lines = text.replace(/\r\n?/g, '\n').split('\n').filter((line) => line.trim() !== '');
  if (lines.length === 0) return { header: [], rows: [] };

  const split = (line) => {
    const cells = [];
    let cell = '';
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '"') {
        if (quoted && line[i + 1] === '"') { cell += '"'; i += 1; } else quoted = !quoted;
      } else if (char === ',' && !quoted) {
        cells.push(cell);
        cell = '';
      } else cell += char;
    }
    cells.push(cell);
    return cells.map((value) => value.trim());
  };

  return { header: split(lines[0]), rows: lines.slice(1).map(split) };
}

function shapeOf(reportType, header) {
  const present = new Set(header);
  const shapes = ACCEPTED_SHAPES[reportType];
  if (shapes.catalogue.every((column) => present.has(column))) return 'catalogue';
  if (shapes.id.every((column) => present.has(column))) return 'id';
  return null;
}

const problem = (code, message, column, rows = []) => ({ code, message, column, rows });

// Reads the file and checks it against what the server will require, so a bad
// file is stopped at this step instead of failing halfway through a sync.
// Returns the same report shape the screen already renders.
export async function validateFile(reportType, entry) {
  if (!entry || !entry.file) {
    return {
      valid: false, level: 'error', source_rows: 0, accepted_rows: 0,
      errors: [problem('missing_file', 'No file was selected for this report.', '')],
      warnings: [],
    };
  }

  let text = '';
  try {
    text = await entry.file.text();
  } catch {
    return {
      valid: false, level: 'error', source_rows: 0, accepted_rows: 0,
      errors: [problem('unreadable', 'This file could not be read as text. Save it as CSV UTF-8.', '')],
      warnings: [],
    };
  }

  const { header, rows } = parseCsv(text);

  if (header.length === 0) {
    return {
      valid: false, level: 'error', source_rows: 0, accepted_rows: 0,
      errors: [problem('empty_file', 'The file is empty.', '')],
      warnings: [],
    };
  }

  const shape = shapeOf(reportType, header);
  if (shape === null) {
    const expected = ACCEPTED_SHAPES[reportType].catalogue;
    const missing = expected.filter((column) => !header.includes(column));
    return {
      valid: false, level: 'error', source_rows: rows.length, accepted_rows: 0,
      errors: [problem(
        'missing_columns',
        `Missing required column(s): ${missing.join(', ')}. This report needs: ${expected.join(', ')}.`,
        missing[0] || '',
      )],
      warnings: [],
    };
  }

  if (rows.length === 0) {
    return {
      valid: false, level: 'error', source_rows: 0, accepted_rows: 0,
      errors: [problem('no_rows', 'The file has a header but no rows.', '')],
      warnings: [],
    };
  }

  const required = ACCEPTED_SHAPES[reportType][shape];
  const position = {};
  header.forEach((column, at) => { position[column] = at; });

  const errors = [];
  const warnings = [];

  // Only columns present in the file are checked, and blank cells are a
  // problem only when the column is one this shape requires — so an optional
  // column left empty never blocks an upload.
  const check = (column, test, code, message) => {
    if (!(column in position)) return;
    const offenders = [];
    rows.forEach((row, at) => {
      const value = (row[position[column]] || '').trim();
      if (value === '') {
        if (required.includes(column)) offenders.push(at + 2);
        return;
      }
      if (!test(value)) offenders.push(at + 2);
    });
    if (offenders.length > 0) {
      errors.push(problem(code, message, column, offenders.slice(0, MAX_REPORTED_ROWS)));
    }
  };

  const isInteger = (value) => /^-?\d+$/.test(value);
  const isNumber = (value) => /^-?\d+(\.\d+)?$/.test(value);
  const isDate = (value) => /^\d{4}-\d{2}-\d{2}/.test(value) && !Number.isNaN(Date.parse(value.slice(0, 10)));

  INTEGER_COLUMNS.forEach((column) => check(column, isInteger, 'not_a_whole_number', `Column '${column}' must contain whole numbers.`));
  DECIMAL_COLUMNS.forEach((column) => check(column, isNumber, 'not_a_number', `Column '${column}' must contain numbers.`));
  DATE_COLUMNS.forEach((column) => check(column, isDate, 'invalid_date', `Column '${column}' must use YYYY-MM-DD format.`));
  QUANTITY_COLUMNS.forEach((column) => check(column, (value) => isInteger(value) && Number(value) >= 0, 'negative_quantity', `Column '${column}' cannot be negative.`));

  // A catalogue file may have to create a product, which needs a name.
  if (shape === 'catalogue') {
    check('product_name', () => true, 'missing_values', "Column 'product_name' cannot be empty.");
  }

  if (shape === 'id') {
    warnings.push(problem(
      'id_shape',
      'This file is keyed on database ids. Rows for products this business does not own will be skipped.',
      'product_id',
    ));
  }

  const valid = errors.length === 0;
  return {
    valid,
    level: valid ? (warnings.length > 0 ? 'warning' : 'success') : 'error',
    shape,
    source_rows: rows.length,
    accepted_rows: valid ? rows.length : 0,
    errors,
    warnings,
  };
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
