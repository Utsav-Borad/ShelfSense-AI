import { AnimatePresence, motion } from 'framer-motion';
import { STATUS_META } from './data';

const EASE = [.16, 1, .3, 1];

const STOCK_OPTIONS = [
  { value: 'all', label: 'Any stock level' },
  { value: 'out', label: 'Out of stock' },
  { value: 'below', label: 'Below minimum' },
  { value: 'healthy', label: 'Above minimum' },
];

const EXPIRY_OPTIONS = [
  { value: 'all', label: 'Any expiry' },
  { value: '3', label: 'Within 3 days' },
  { value: '7', label: 'Within 7 days' },
  { value: '30', label: 'Within 30 days' },
  { value: '90', label: 'Within 90 days' },
];

// Slides open and closed rather than appearing, so the table below moves with
// it instead of jumping.
export default function FilterPanel({ open, filters, onChange, onReset, activeCount, categories = [], suppliers = [] }) {
  const set = (key) => (event) => onChange({ ...filters, [key]: event.target.value });

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          className="inv-filters"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: .34, ease: EASE }}
        >
          <div className="inv-filters-inner">
            <label className="inv-filter">
              <span>Category</span>
              <select value={filters.category} onChange={set('category')}>
                <option value="all">All categories</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>

            <label className="inv-filter">
              <span>Supplier</span>
              <select value={filters.supplier} onChange={set('supplier')}>
                <option value="all">All suppliers</option>
                {suppliers.map((supplier) => <option key={supplier} value={supplier}>{supplier}</option>)}
              </select>
            </label>

            <label className="inv-filter">
              <span>Status</span>
              <select value={filters.status} onChange={set('status')}>
                <option value="all">All statuses</option>
                {Object.entries(STATUS_META).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}
              </select>
            </label>

            <label className="inv-filter">
              <span>Stock</span>
              <select value={filters.stock} onChange={set('stock')}>
                {STOCK_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>

            <label className="inv-filter">
              <span>Expiry</span>
              <select value={filters.expiry} onChange={set('expiry')}>
                {EXPIRY_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>

            <button type="button" className="inv-filter-reset" onClick={onReset} disabled={activeCount === 0}>
              <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />Reset
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
