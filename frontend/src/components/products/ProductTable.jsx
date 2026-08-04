import { AnimatePresence, motion } from 'framer-motion';
import { Sparkline } from '../charts';
import { ScoreRing } from './ProductCard';
import { STATUS_META } from './data';

const EASE = [.16, 1, .3, 1];

// Same data, denser reading. Shares the card's score ring and sparkline so the
// two views stay recognisably the same product.
export default function ProductTable({ products, highlighted, onOpen }) {
  return (
    <div className="pi-table-wrap">
      <table className="pi-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th className="is-numeric">Stock</th>
            <th>Demand</th>
            <th className="is-numeric">Value</th>
            <th>Status</th>
            <th className="is-numeric">AI score</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {products.map((product, index) => {
              const meta = STATUS_META[product.status];
              return (
                <motion.tr
                  key={product.id}
                  className={highlighted.includes(product.id) ? 'is-highlight' : ''}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: .3, delay: Math.min(index, 12) * .03, ease: EASE }}
                  onClick={() => onOpen(product)}
                >
                  <td>
                    <span className="pi-table-product">
                      <span className={`pi-table-thumb tone-${product.tone}`}><i className={`bi ${product.icon}`} aria-hidden="true" /></span>
                      <span>
                        <strong>{product.name}</strong>
                        <small>{product.brand} · {product.unit}</small>
                      </span>
                    </span>
                  </td>
                  <td>{product.category}</td>
                  <td className="is-numeric">
                    <span className={product.stock <= product.minStock ? 'pi-low' : ''}>{product.stock}</span>
                  </td>
                  <td>
                    <span className="pi-table-demand">
                      <em className={product.trend >= 0 ? 'is-up' : 'is-down'}>
                        <i className={`bi bi-arrow-${product.trend >= 0 ? 'up' : 'down'}-short`} aria-hidden="true" />
                        {Math.abs(product.trend)}%
                      </em>
                      <span className="pi-table-spark">
                        <Sparkline values={product.spark} tone={product.trend >= 0 ? 'olive' : 'danger'} delay={.1} />
                      </span>
                    </span>
                  </td>
                  <td className="is-numeric">₹{product.value.toLocaleString('en-IN')}</td>
                  <td>
                    <span className={`pi-status is-inline tone-${meta.tone}`}>
                      <i className={`bi ${meta.icon}`} aria-hidden="true" />{meta.label}
                    </span>
                  </td>
                  <td className="is-numeric"><ScoreRing value={product.score} delay={.15} size="sm" /></td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
