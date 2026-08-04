import { AnimatePresence, motion } from 'framer-motion';
import { ReliabilityRing } from './SupplierCard';
import { STATUS_META } from './data';

const EASE = [.16, 1, .3, 1];

export default function SupplierTable({ suppliers, highlighted, onOpen }) {
  return (
    <div className="sp-table-wrap">
      <table className="sp-table">
        <thead>
          <tr>
            <th>Supplier</th>
            <th>Categories</th>
            <th>Delivery performance</th>
            <th className="is-numeric">Purchases</th>
            <th className="is-numeric">Avg time</th>
            <th>Last delivery</th>
            <th>Status</th>
            <th className="is-numeric">Reliability</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={false}>
            {suppliers.map((supplier, index) => {
              const meta = STATUS_META[supplier.status];
              return (
                <motion.tr
                  key={supplier.id}
                  className={highlighted.includes(supplier.id) ? 'is-highlight' : ''}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: .3, delay: Math.min(index, 10) * .035, ease: EASE }}
                  onClick={() => onOpen(supplier)}
                >
                  <td>
                    <span className="sp-table-supplier">
                      <span className={`sp-avatar is-sm tone-${meta.tone}`}>{supplier.initials}</span>
                      <span>
                        <strong>{supplier.name}</strong>
                        <small>{supplier.code} · {supplier.orders} orders</small>
                      </span>
                    </span>
                  </td>
                  <td>
                    <span className="sp-table-tags">
                      {supplier.categories.map((category) => <em key={category}>{category}</em>)}
                    </span>
                  </td>
                  <td>
                    <span className="sp-table-perf">
                      <span className="sp-bar-track is-sm">
                        <motion.i
                          className={`tone-${supplier.onTime >= 90 ? 'success' : supplier.onTime >= 80 ? 'olive' : 'warning'}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: supplier.onTime / 100 }}
                          transition={{ duration: .9, delay: .1, ease: EASE }}
                        />
                      </span>
                      <b>{supplier.onTime}%</b>
                      {supplier.delayedRecent > 0 && <em className="sp-table-delay">{supplier.delayedRecent} late</em>}
                    </span>
                  </td>
                  <td className="is-numeric">₹{(supplier.purchases / 1000).toFixed(0)}k</td>
                  <td className="is-numeric">{supplier.avgDays}d</td>
                  <td className="sp-nowrap">{supplier.lastDelivery}</td>
                  <td>
                    <span className={`sp-status is-inline tone-${meta.tone}`}>
                      <i className={`bi ${meta.icon}`} aria-hidden="true" />{meta.label}
                    </span>
                  </td>
                  <td className="is-numeric"><ReliabilityRing value={supplier.reliability} delay={.15} size="sm" /></td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
