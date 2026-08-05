import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EmptyState from '../ui/EmptyState';

const EASE = [.16, 1, .3, 1];

export default function TopProducts({ items = [] }) {
  const products = items;

  return (
    <motion.section
      className="dash-card dash-panel"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .7, delay: .18, ease: EASE }}
      whileHover={{ y: -4, transition: { duration: .28, ease: 'easeOut' } }}
    >
      <span className="dash-sweep" aria-hidden="true" />
      <header className="dash-panel-head">
        <div>
          <p className="dash-eyebrow">Top products</p>
          <h3>What is funding the week</h3>
        </div>
        <Link to="/products" className="dash-chip is-link">All <i className="bi bi-arrow-up-right" aria-hidden="true" /></Link>
      </header>

      {products.length === 0 ? (
        <EmptyState icon="bi-bag" title="No movement yet" description="Your best sellers appear after the first synchronization." />
      ) : (
        <ol className="dash-products">
          {products.map((product, index) => (
            <motion.li
              key={product.name}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: .5, delay: .35 + index * .08, ease: EASE }}
            >
              <span className="dash-rank">{index + 1}</span>
              <span className="dash-product-main">
                <strong>{product.name}</strong>
                <small>{product.units.toLocaleString('en-IN')} units sold</small>
              </span>
              {/* No period-on-period badge: the reports endpoint returns totals
                  for one window, with nothing to compare them against. */}
              <span className="dash-product-figures">
                <b>₹{product.revenue.toLocaleString('en-IN')}</b>
              </span>
            </motion.li>
          ))}
        </ol>
      )}
    </motion.section>
  );
}
