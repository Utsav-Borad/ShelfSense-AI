import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useDrawer from '../../hooks/useDrawer';
import { Sparkline } from '../charts';
import { ScoreRing } from './ProductCard';
import { STATUS_META } from './data';

const EASE = [.16, 1, .3, 1];

export default function ProductDrawer({ product, onClose }) {
  // Escape, scroll lock, focus trap and focus restore — shared by every drawer.
  const panelRef = useRef(null);
  useDrawer(Boolean(product), onClose, panelRef);

  const meta = product ? STATUS_META[product.status] : null;

  return (
    <AnimatePresence>
      {product && (
        <>
          <motion.div
            className="pi-drawer-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: .28 }} onClick={onClose} aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            className="pi-drawer"
            role="dialog" aria-modal="true" aria-label={`${product.name} intelligence`}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: .42, ease: EASE }}
          >
            <header className="pi-drawer-head">
              <span className={`pi-drawer-thumb tone-${product.tone}`}>
                <i className={`bi ${product.icon}`} aria-hidden="true" />
                <span>{product.initials}</span>
              </span>
              <div>
                <span className={`pi-status is-inline tone-${meta.tone}`}>
                  <i className={`bi ${meta.icon}`} aria-hidden="true" />{meta.label}
                </span>
                <h3>{product.name}</h3>
                <p>{product.brand} · {product.category} · {product.unit}</p>
              </div>
              <button type="button" className="pi-drawer-close" onClick={onClose} aria-label="Close details">
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </header>

            <div className="pi-drawer-body">
              <div className="pi-drawer-score">
                <ScoreRing value={product.score} delay={.2} size="lg" />
                <div>
                  <strong>AI product score</strong>
                  <p>Blended from demand trend, margin, stock cover and how the category is moving.</p>
                </div>
              </div>

              <section className="pi-drawer-block">
                <h4>Demand over 7 weeks</h4>
                <div className="pi-drawer-chart">
                  <Sparkline values={product.spark} tone={product.trend >= 0 ? 'olive' : 'danger'} delay={.25} />
                </div>
                <p className={`pi-drawer-trend ${product.trend >= 0 ? 'is-up' : 'is-down'}`}>
                  <i className={`bi bi-arrow-${product.trend >= 0 ? 'up' : 'down'}-right`} aria-hidden="true" />
                  {product.trend >= 0 ? 'Up' : 'Down'} {Math.abs(product.trend)}% against the previous period
                </p>
              </section>

              <dl className="pi-drawer-rows">
                {[
                  ['Current stock', `${product.stock}`],
                  ['Minimum stock', `${product.minStock}`],
                  ['Selling price', `₹${product.price}`],
                  ['Purchase price', `₹${product.cost}`],
                  ['Margin', `${product.margin}%`],
                  ['Inventory value', `₹${product.value.toLocaleString('en-IN')}`],
                ].map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>

              <p className="pi-drawer-note">
                <i className="bi bi-hand-index-thumb" aria-hidden="true" />
                Advisory only. Products and stock are written by CSV synchronization, never edited here.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
