import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import EmptyState from '../ui/EmptyState';
import { TOP_PRODUCTS } from './data';

const EASE = [.16, 1, .3, 1];

export default function TopProducts() {
  const products = TOP_PRODUCTS;

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
                <small>{product.category} · {product.units} units</small>
              </span>
              <span className="dash-product-figures">
                <b>₹{product.revenue.toLocaleString('en-IN')}</b>
                <em className={product.trend >= 0 ? 'is-good' : 'is-bad'}>
                  <i className={`bi bi-arrow-${product.trend >= 0 ? 'up' : 'down'}-short`} aria-hidden="true" />
                  {Math.abs(product.trend)}%
                </em>
              </span>
            </motion.li>
          ))}
        </ol>
      )}
    </motion.section>
  );
}
