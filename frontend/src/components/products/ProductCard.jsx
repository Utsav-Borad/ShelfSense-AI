import { motion } from 'framer-motion';
import { Sparkline } from '../charts';
import useCountUp from '../../hooks/useCountUp';
import { STATUS_META } from './data';

const EASE = [.16, 1, .3, 1];
const RADIUS = 17;

// The AI score, drawn as a ring that fills while the number counts.
export function ScoreRing({ value, delay = 0, size = 'md' }) {
  const shown = useCountUp(value, { duration: 1200, delay: delay * 1000 });
  const tone = value >= 80 ? 'success' : value >= 55 ? 'olive' : value >= 40 ? 'warning' : 'danger';

  return (
    <span className={`pi-ring is-${size} tone-${tone}`} aria-label={`AI score ${value} out of 100`}>
      <svg viewBox="0 0 44 44" aria-hidden="true">
        <circle className="pi-ring-track" cx="22" cy="22" r={RADIUS} />
        <motion.circle
          className="pi-ring-arc"
          cx="22" cy="22" r={RADIUS}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: 1.2, delay, ease: EASE }}
        />
      </svg>
      <b>{Math.round(shown)}</b>
    </span>
  );
}

export default function ProductCard({ product, index, highlighted, onOpen }) {
  const meta = STATUS_META[product.status];
  const delay = Math.min(index, 11) * .06;

  return (
    <motion.article
      className={`pi-card${highlighted ? ' is-highlight' : ''}`}
      initial={{ opacity: 0, y: 26, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: .98 }}
      transition={{ duration: .6, delay, ease: EASE }}
      whileHover={{ y: -6, transition: { duration: .28, ease: 'easeOut' } }}
      layout
    >
      <span className="pi-sweep" aria-hidden="true" />

      {/* Placeholder imagery: a category-tinted tile, not a photograph. */}
      <button type="button" className={`pi-thumb tone-${product.tone}`} onClick={() => onOpen(product)} aria-label={`Open ${product.name}`}>
        <i className={`bi ${product.icon}`} aria-hidden="true" />
        <span className="pi-thumb-initials">{product.initials}</span>
        <span className={`pi-status tone-${meta.tone}`}>
          <i className={`bi ${meta.icon}`} aria-hidden="true" />{meta.label}
        </span>
      </button>

      <div className="pi-card-body">
        <div className="pi-card-top">
          <div className="pi-card-title">
            <button type="button" onClick={() => onOpen(product)}>{product.name}</button>
            <small>{product.brand} · {product.category}</small>
          </div>
          <ScoreRing value={product.score} delay={delay + .25} />
        </div>

        <dl className="pi-card-stats">
          <div>
            <dt>Stock</dt>
            <dd className={product.stock <= product.minStock ? 'is-low' : ''}>
              {product.stock}<small>min {product.minStock}</small>
            </dd>
          </div>
          <div>
            <dt>Demand</dt>
            <dd className={product.trend >= 0 ? 'is-up' : 'is-down'}>
              <i className={`bi bi-arrow-${product.trend >= 0 ? 'up' : 'down'}-short`} aria-hidden="true" />
              {Math.abs(product.trend)}%
            </dd>
          </div>
          <div>
            <dt>Value</dt>
            <dd>₹{product.value.toLocaleString('en-IN')}</dd>
          </div>
        </dl>

        <div className="pi-card-spark">
          <Sparkline values={product.spark} tone={product.trend >= 0 ? 'olive' : 'danger'} delay={delay + .3} />
        </div>
      </div>
    </motion.article>
  );
}
