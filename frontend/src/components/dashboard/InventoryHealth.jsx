import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EASE = [.16, 1, .3, 1];

// Where the capital actually sits. Bars grow rather than appear.
export default function InventoryHealth({ items = [] }) {
  return (
    <motion.section
      className="dash-card dash-panel"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .7, delay: .12, ease: EASE }}
      whileHover={{ y: -4, transition: { duration: .28, ease: 'easeOut' } }}
    >
      <span className="dash-sweep" aria-hidden="true" />
      <header className="dash-panel-head">
        <div>
          <p className="dash-eyebrow">Inventory health</p>
          <h3>418 products, sorted by risk</h3>
        </div>
        <Link to="/inventory" className="dash-chip is-link">Open <i className="bi bi-arrow-up-right" aria-hidden="true" /></Link>
      </header>

      <ul className="dash-bars">
        {items.map((row, index) => (
          <li key={row.label}>
            <span className="dash-bar-head">
              <small><i className={`dash-swatch tone-${row.tone}`} aria-hidden="true" />{row.label}</small>
              <b>{row.count} <em>{row.value}%</em></b>
            </span>
            <span className="dash-bar-track">
              <motion.i
                className={`tone-${row.tone}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: row.value / 100 }}
                transition={{ duration: 1.1, delay: .35 + index * .12, ease: EASE }}
              />
            </span>
          </li>
        ))}
      </ul>

      <p className="dash-panel-foot">
        <i className="bi bi-info-circle" aria-hidden="true" />
        ₹42,800 is held in dead stock — the largest single recovery available to you.
      </p>
    </motion.section>
  );
}
