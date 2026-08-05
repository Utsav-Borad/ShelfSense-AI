import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useDrawer from '../../hooks/useDrawer';
import { PerformanceBar, ReliabilityRing } from './SupplierCard';
import { DELIVERIES, STATUS_META } from './data';

const EASE = [.16, 1, .3, 1];
const DELIVERY_TONE = { 'on-time': 'success', late: 'danger', short: 'warning' };
const DELIVERY_LABEL = { 'on-time': 'On time', late: 'Late', short: 'Short' };

export default function SupplierDrawer({ supplier, onClose }) {
  // Escape, scroll lock, focus trap and focus restore — shared by every drawer.
  const panelRef = useRef(null);
  useDrawer(Boolean(supplier), onClose, panelRef);

  const meta = supplier ? STATUS_META[supplier.status] : null;

  return (
    <AnimatePresence>
      {supplier && (
        <>
          <motion.div
            className="sp-drawer-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: .28 }} onClick={onClose} aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            className="sp-drawer"
            role="dialog" aria-modal="true" aria-label={`${supplier.name} profile`}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: .42, ease: EASE }}
          >
            <header className="sp-drawer-head">
              <span className={`sp-avatar is-lg tone-${meta.tone}`}>{supplier.initials}</span>
              <div>
                <span className={`sp-status is-inline tone-${meta.tone}`}>
                  <i className={`bi ${meta.icon}`} aria-hidden="true" />{meta.label}
                </span>
                <h3>{supplier.name}</h3>
                <p>{supplier.code} · {supplier.products} product(s)</p>
              </div>
              <button type="button" className="sp-drawer-close" onClick={onClose} aria-label="Close profile">
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </header>

            <div className="sp-drawer-body">
              <div className="sp-drawer-score">
                <ReliabilityRing value={supplier.share} delay={.2} size="lg" />
                <div>
                  <strong>Reliability score</strong>
                  <p>Share of the capital held across all your suppliers. Delivery performance is not scored — no purchase orders are recorded.</p>
                </div>
              </div>

              <section className="sp-drawer-block">
                <h4>Delivery performance</h4>
                <PerformanceBar label="Share of stock value" value={supplier.share} tone="olive" delay={.25} />
              </section>

              <dl className="sp-drawer-rows">
                {[
                  ['Products supplied', `${supplier.products}`],
                  ['Units held', supplier.units.toLocaleString('en-IN')],
                  ['Stock value', `₹${Math.round(supplier.stockValue).toLocaleString('en-IN')}`],
                  ['Products needing attention', `${supplier.atRisk}`],
                  ['Phone', supplier.phone],
                  ['Email', supplier.email],
                ].map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>

              <section className="sp-drawer-block">
                <h4>Recent deliveries</h4>
                <ol className="sp-deliveries">
                  {DELIVERIES.map((delivery, index) => (
                    <motion.li
                      key={delivery.id}
                      initial={{ opacity: 0, x: 14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: .4, delay: .3 + index * .07, ease: EASE }}
                    >
                      <span className={`sp-delivery-dot tone-${DELIVERY_TONE[delivery.status]}`} aria-hidden="true" />
                      <div>
                        <strong>{delivery.ref}</strong>
                        <small>{delivery.items} items · ₹{delivery.value.toLocaleString('en-IN')}</small>
                      </div>
                      <span className={`sp-delivery-tag tone-${DELIVERY_TONE[delivery.status]}`}>{DELIVERY_LABEL[delivery.status]}</span>
                      <time>{delivery.when}</time>
                    </motion.li>
                  ))}
                </ol>
              </section>

              <p className="sp-drawer-note">
                <i className="bi bi-hand-index-thumb" aria-hidden="true" />
                Advisory only. Supplier scoring is guidance — the purchasing decision stays yours.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
