import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { PERSONALIZATION } from './data';

const EASE = [.16, 1, .3, 1];

export default function PersonalizationSummary({ onCustomize, onReady, themeLabel }) {
  const { user } = useAuth();
  const [shown, setShown] = useState(0);
  const revealing = shown < PERSONALIZATION.length;

  useEffect(() => {
    if (!revealing) { onReady?.(); return undefined; }
    const timer = setTimeout(() => setShown(shown + 1), shown === 0 ? 900 : 520);
    return () => clearTimeout(timer);
  }, [shown, revealing, onReady]);

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : null;

  return (
    <motion.section
      className="st-hero"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .85, ease: EASE }}
      aria-labelledby="st-hero-title"
    >
      <span className="st-hero-glow" aria-hidden="true" />

      <header className="st-hero-head">
        <motion.span
          className="st-avatar"
          initial={{ opacity: 0, scale: .82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .7, ease: EASE }}
        >
          <motion.i
            className="bi bi-robot"
            animate={revealing ? { scale: [1, 1.12, 1], opacity: [.75, 1, .75] } : { scale: 1, opacity: 1 }}
            transition={revealing ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : { duration: .4 }}
            aria-hidden="true"
          />
        </motion.span>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .22, ease: EASE }}>
          <p className="st-eyebrow">Personalization center</p>
          <h2 id="st-hero-title">Hello{firstName ? `, ${firstName}` : ''}.</h2>
          <p className="st-hero-sub">Here’s how ShelfSense AI is currently helping your business.</p>
        </motion.div>
      </header>

      <ul className="st-hero-list" aria-live="polite">
        <AnimatePresence initial={false}>
          {PERSONALIZATION.slice(0, shown).map((item) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: .5, ease: EASE }}
            >
              {/* The tick draws itself as the line lands. */}
              <motion.span
                className="st-check"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: .45, delay: .12, ease: EASE }}
                aria-hidden="true"
              >
                <i className="bi bi-check-lg" />
              </motion.span>
              <span className="st-hero-icon"><i className={`bi ${item.icon}`} aria-hidden="true" /></span>
              <span className="st-hero-label">{item.label}</span>
              <b>{item.id === 'p5' ? themeLabel : item.value}</b>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {!revealing && (
          <motion.div
            className="st-hero-actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .6, delay: .2, ease: EASE }}
          >
            <p className="st-hero-verdict">
              <i className="bi bi-check-circle" aria-hidden="true" />
              Your AI assistant is optimized for your business.
            </p>
            <button type="button" className="st-btn st-btn-primary" onClick={onCustomize}>
              <i className="bi bi-sliders" aria-hidden="true" />Customize AI
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
