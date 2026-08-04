import { motion } from 'framer-motion';
import { STATUS_META } from './data';

// Critical statuses breathe gently so the eye finds them in a long table.
// Everything else stays still.
export default function StatusBadge({ status, urgent = false }) {
  const meta = STATUS_META[status];
  const pulse = Boolean(meta.critical) || urgent;

  return (
    <motion.span
      className={`inv-badge tone-${meta.tone}${pulse ? ' is-critical' : ''}`}
      animate={pulse ? { opacity: [1, .72, 1] } : { opacity: 1 }}
      transition={pulse ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : { duration: .2 }}
    >
      <i className={`bi ${meta.icon}`} aria-hidden="true" />
      {meta.label}
    </motion.span>
  );
}
