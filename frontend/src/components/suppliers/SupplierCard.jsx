import { motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';
import { STATUS_META } from './data';

const EASE = [.16, 1, .3, 1];
const RADIUS = 19;

// A 0-100 ring. Used for share of stock value, not a reliability score —
// no delivery history exists to score reliability from.
export function ReliabilityRing({ value, delay = 0, size = 'md' }) {
  const shown = useCountUp(value, { duration: 1200, delay: delay * 1000 });
  const tone = value >= 92 ? 'success' : value >= 82 ? 'olive' : value >= 70 ? 'warning' : 'danger';

  return (
    <span className={`sp-ring is-${size} tone-${tone}`} aria-label={`${value} out of 100`}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className="sp-ring-track" cx="24" cy="24" r={RADIUS} />
        <motion.circle
          className="sp-ring-arc"
          cx="24" cy="24" r={RADIUS}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: 1.2, delay, ease: EASE }}
        />
      </svg>
      <b>{Math.round(shown)}</b>
    </span>
  );
}

// A labelled bar that grows into place.
export function PerformanceBar({ label, value, suffix = '%', tone = 'olive', delay = 0 }) {
  return (
    <div className="sp-bar">
      <span className="sp-bar-head">
        <small>{label}</small>
        <b>{value}{suffix}</b>
      </span>
      <span className="sp-bar-track">
        <motion.i
          className={`tone-${tone}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: Math.min(value, 100) / 100 }}
          transition={{ duration: 1.05, delay, ease: EASE }}
        />
      </span>
    </div>
  );
}

export default function SupplierCard({ supplier, index, highlighted, onOpen }) {
  const meta = STATUS_META[supplier.status];
  const delay = Math.min(index, 9) * .07;

  return (
    <motion.article
      className={`sp-card${highlighted ? ' is-highlight' : ''}`}
      initial={{ opacity: 0, y: 26, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: .98 }}
      transition={{ duration: .6, delay, ease: EASE }}
      whileHover={{ y: -6, transition: { duration: .28, ease: 'easeOut' } }}
      layout
    >
      <span className="sp-sweep" aria-hidden="true" />

      <header className="sp-card-head">
        <span className={`sp-avatar tone-${meta.tone}`}>{supplier.initials}</span>
        <div className="sp-card-title">
          <button type="button" onClick={() => onOpen(supplier)}>{supplier.name}</button>
          <small>{supplier.code} · {supplier.products} product(s)</small>
        </div>
        <ReliabilityRing value={supplier.share} delay={delay + .25} />
      </header>

      <span className={`sp-status tone-${meta.tone}`}>
        <i className={`bi ${meta.icon}`} aria-hidden="true" />{meta.label}
      </span>

      <div className="sp-bars">
        <PerformanceBar label="Share of stock value" value={supplier.share} tone="olive" delay={delay + .3} />
      </div>

      <dl className="sp-card-stats">
        <div><dt>Stock value</dt><dd>₹{Math.round(supplier.stockValue).toLocaleString('en-IN')}</dd></div>
        <div><dt>Units held</dt><dd>{supplier.units.toLocaleString('en-IN')}</dd></div>
        <div><dt>Products</dt><dd>{supplier.products}</dd></div>
      </dl>

      {supplier.atRisk > 0 && (
        <p className="sp-flag">
          <i className="bi bi-exclamation-triangle" aria-hidden="true" />
          {supplier.atRisk} product(s) from this supplier need attention
        </p>
      )}
    </motion.article>
  );
}
