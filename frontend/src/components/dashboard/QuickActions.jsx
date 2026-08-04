import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QUICK_ACTIONS } from './data';

const EASE = [.16, 1, .3, 1];

export default function QuickActions() {
  return (
    <section className="dash-quick" aria-label="Quick actions">
      {QUICK_ACTIONS.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .6, delay: .2 + index * .07, ease: EASE }}
          whileHover={{ y: -4, transition: { duration: .26, ease: 'easeOut' } }}
        >
          <Link to={action.to} className="dash-card dash-quick-card">
            <span className="dash-sweep" aria-hidden="true" />
            <motion.span className="dash-quick-icon" whileHover={{ rotate: -8, scale: 1.08 }} transition={{ duration: .3, ease: 'easeOut' }}>
              <i className={`bi ${action.icon}`} aria-hidden="true" />
            </motion.span>
            <span className="dash-quick-text">
              <strong>{action.label}</strong>
              <small>{action.hint}</small>
            </span>
            <i className="bi bi-arrow-right dash-quick-arrow" aria-hidden="true" />
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
