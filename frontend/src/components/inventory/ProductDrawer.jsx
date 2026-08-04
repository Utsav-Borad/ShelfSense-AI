import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useDrawer from '../../hooks/useDrawer';
import StatusBadge from './StatusBadge';
import { HISTORY } from './data';

const EASE = [.16, 1, .3, 1];

// A drawer, not a modal: it slides in from the right over a blurred backdrop
// and leaves the table visible behind it.
export default function ProductDrawer({ product, tab, onTab, onClose }) {
  // Escape, scroll lock, focus trap and focus restore — shared by every drawer.
  const panelRef = useRef(null);
  useDrawer(Boolean(product), onClose, panelRef);

  const rows = product ? [
    ['Barcode', product.barcode], ['Brand', product.brand], ['Category', product.category],
    ['Supplier', product.supplier], ['Unit', product.unit],
    ['MRP', `₹${product.mrp}`], ['Selling price', `₹${product.price}`], ['Purchase price', `₹${product.cost}`],
    ['Available', `${product.available}`], ['Reserved', `${product.reserved}`], ['Damaged', `${product.damaged}`],
    ['Minimum stock', `${product.minStock}`], ['Stock value', `₹${product.value.toLocaleString('en-IN')}`],
    ['Expiry date', product.expiryDate], ['Last sold', product.daysSinceSold === 0 ? 'Today' : `${product.daysSinceSold} days ago`],
  ] : [];

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="inv-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .28 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            className="inv-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} details`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: .42, ease: EASE }}
          >
            <header className="inv-drawer-head">
              <div>
                <StatusBadge status={product.status} urgent={product.expiryInDays <= 3} />
                <h3>{product.name}</h3>
                <p>{product.brand} · {product.unit}</p>
              </div>
              <button type="button" className="inv-drawer-close" onClick={onClose} aria-label="Close details">
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </header>

            <nav className="inv-drawer-tabs" role="tablist">
              {[['details', 'Details'], ['edit', 'Edit'], ['history', 'History']].map(([id, label]) => (
                <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'is-active' : ''} onClick={() => onTab(id)}>
                  {label}
                </button>
              ))}
            </nav>

            <div className="inv-drawer-body">
              {tab === 'details' && (
                <>
                  <div className="inv-drawer-stats">
                    <div><small>On hand</small><strong>{product.available}</strong></div>
                    <div><small>Expires in</small><strong>{product.expiryInDays}d</strong></div>
                    <div><small>Stock value</small><strong>₹{product.value.toLocaleString('en-IN')}</strong></div>
                  </div>
                  <dl className="inv-drawer-rows">
                    {rows.map(([label, value]) => (
                      <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                    ))}
                  </dl>
                </>
              )}

              {tab === 'edit' && (
                <form className="inv-drawer-form" onSubmit={(event) => event.preventDefault()}>
                  <p className="inv-drawer-note">
                    <i className="bi bi-info-circle" aria-hidden="true" />
                    Products, stock and sales are written by CSV synchronization only — these fields are read-only by design.
                  </p>
                  {[['Product name', product.name], ['Selling price', `₹${product.price}`], ['Minimum stock', product.minStock], ['Supplier', product.supplier]].map(([label, value]) => (
                    <label key={label}>
                      <span>{label}</span>
                      <input value={value} readOnly disabled />
                    </label>
                  ))}
                  <button type="button" className="inv-btn inv-btn-ghost" disabled>
                    <i className="bi bi-lock" aria-hidden="true" />Editing disabled
                  </button>
                </form>
              )}

              {tab === 'history' && (
                <ol className="inv-drawer-history">
                  {HISTORY.map((event, index) => (
                    <motion.li
                      key={event.id}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: .4, delay: index * .07, ease: EASE }}
                    >
                      <span className={`inv-history-dot tone-${event.tone}`}><i className={`bi ${event.icon}`} aria-hidden="true" /></span>
                      <div><strong>{event.title}</strong><small>{event.detail}</small></div>
                      <time>{event.when}</time>
                    </motion.li>
                  ))}
                </ol>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
