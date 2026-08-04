import { AnimatePresence, motion } from 'framer-motion';

// Submit with loading and success states. Disabled while busy so a double
// submit cannot fire, and aria-busy tells assistive tech what is happening.
export default function SubmitButton({ loading, success, children, successLabel = 'Done', className = '', ...props }) {
  const busy = loading || success;
  return (
    <motion.button
      type="submit"
      className={`auth-submit${success ? ' is-success' : ''} ${className}`}
      disabled={busy}
      aria-busy={loading ? 'true' : 'false'}
      whileTap={busy ? undefined : { scale: .985 }}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {loading && (
          <motion.span key="loading" className="auth-submit-inner" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }}>
            <span className="auth-spinner" aria-hidden="true" />Working…
          </motion.span>
        )}
        {!loading && success && (
          <motion.span key="success" className="auth-submit-inner" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }}>
            <i className="bi bi-check-lg" aria-hidden="true" />{successLabel}
          </motion.span>
        )}
        {!loading && !success && (
          <motion.span key="idle" className="auth-submit-inner" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .2 }}>
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
