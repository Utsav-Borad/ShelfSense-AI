import { AnimatePresence, motion } from 'framer-motion';
import EmptyState from '../ui/EmptyState';
import ErrorState from '../ui/ErrorState';
import StatusBadge from './StatusBadge';

const EASE = [.16, 1, .3, 1];

const SORTABLE = { name: 'Product', category: 'Category', supplier: 'Supplier', available: 'Stock', value: 'Value', expiry: 'Expiry', status: 'Status' };

function SkeletonRows({ columns }) {
  return (
    <tbody>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
        <tr key={n} className="inv-skeleton-row">
          {columns.map((column) => <td key={column}><span className="inv-sk" /></td>)}
          <td><span className="inv-sk" /></td>
        </tr>
      ))}
    </tbody>
  );
}

export default function InventoryTable({
  products, columns, sort, onSort, loading, error, onRetry,
  onView, onEdit, onHistory, highlight,
}) {
  const shows = (id) => columns.includes(id);

  if (error) {
    return (
      <div className="inv-table-state">
        <ErrorState title="We could not load your inventory" description="Something went wrong on the way. Try again in a moment." />
        <button type="button" className="inv-btn inv-btn-ghost" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise" aria-hidden="true" />Try again
        </button>
      </div>
    );
  }

  const header = (id, label, numeric = false) => (
    <th key={id} className={numeric ? 'is-numeric' : ''} aria-sort={sort.key === id ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => onSort(id)}>
        {label}
        <i className={`bi bi-${sort.key === id ? (sort.direction === 'asc' ? 'caret-up-fill' : 'caret-down-fill') : 'chevron-expand'}`} aria-hidden="true" />
      </button>
    </th>
  );

  return (
    <div className="inv-table-wrap">
      <table className="inv-table">
        <thead>
          <tr>
            {header('name', SORTABLE.name)}
            {shows('category') && header('category', SORTABLE.category)}
            {shows('supplier') && header('supplier', SORTABLE.supplier)}
            {shows('available') && header('available', SORTABLE.available, true)}
            {shows('value') && header('value', SORTABLE.value, true)}
            {shows('expiry') && header('expiry', SORTABLE.expiry)}
            {header('status', SORTABLE.status)}
            <th className="inv-actions-head"><span className="visually-hidden">Actions</span></th>
          </tr>
        </thead>

        {loading ? (
          <SkeletonRows columns={['name', ...columns.filter((c) => c !== 'name' && c !== 'status'), 'status']} />
        ) : (
          <tbody>
            <AnimatePresence initial={false}>
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  className={highlight === product.status ? 'is-highlight' : ''}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: .32, delay: Math.min(index, 12) * .035, ease: EASE }}
                >
                  <td>
                    <button type="button" className="inv-product-cell" onClick={() => onView(product)}>
                      <span className="inv-product-name">{product.name}</span>
                      <small>{product.brand} · {product.unit} · <code>{product.barcode}</code></small>
                    </button>
                  </td>
                  {shows('category') && <td>{product.category}</td>}
                  {shows('supplier') && <td className="inv-muted">{product.supplier}</td>}
                  {shows('available') && (
                    <td className="is-numeric">
                      <span className="inv-stock">
                        <b>{product.available}</b>
                        <small>min {product.minStock}</small>
                      </span>
                    </td>
                  )}
                  {shows('value') && <td className="is-numeric">₹{product.value.toLocaleString('en-IN')}</td>}
                  {shows('expiry') && (
                    <td>
                      <span className={`inv-expiry${product.expiryInDays <= 7 ? ' is-urgent' : ''}`}>
                        {product.expiryInDays <= 0 ? 'Expired' : `${product.expiryInDays}d`}
                        <small>{product.expiryDate}</small>
                      </span>
                    </td>
                  )}
                  <td><StatusBadge status={product.status} urgent={product.expiryInDays <= 3} /></td>
                  <td className="inv-actions-cell">
                    <span className="inv-row-actions">
                      <button type="button" onClick={() => onView(product)} aria-label={`View ${product.name}`} title="View"><i className="bi bi-eye" aria-hidden="true" /></button>
                      <button type="button" onClick={() => onEdit(product)} aria-label={`Edit ${product.name}`} title="Edit"><i className="bi bi-pencil" aria-hidden="true" /></button>
                      <button type="button" onClick={() => onHistory(product)} aria-label={`History for ${product.name}`} title="History"><i className="bi bi-clock-history" aria-hidden="true" /></button>
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        )}
      </table>

      {!loading && products.length === 0 && (
        <div className="inv-table-state">
          <EmptyState icon="bi-search" title="No products match" description="Try a different search term, or reset the filters." />
        </div>
      )}
    </div>
  );
}
