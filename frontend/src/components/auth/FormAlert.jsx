import { AnimatePresence, motion } from 'framer-motion';

const icons = { error: 'bi-exclamation-octagon', success: 'bi-check-circle', info: 'bi-info-circle' };

// Form-level banner for messages that are not tied to one field — a failed
// login, an expired reset link, a confirmation. role="alert" for errors so it
// is announced immediately; "status" for the calmer tones.
export default function FormAlert({ tone = 'error', message }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.div
          className={`auth-alert tone-${tone}`}
          role={tone === 'error' ? 'alert' : 'status'}
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: 'auto', marginBottom: 18 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          transition={{ duration: .28, ease: [.16, 1, .3, 1] }}
        >
          <span><i className={`bi ${icons[tone]}`} aria-hidden="true" />{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
