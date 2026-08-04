import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { BRIEF_LINES, greetingFor } from './data';

const EASE = [.16, 1, .3, 1];

// The brief arrives as its own small timeline — the rail grows downward while
// each line lands beneath it.
export default function MorningBrief({ unreadCount, onJump, onReady }) {
  const { user } = useAuth();
  const [shown, setShown] = useState(0);
  const revealing = shown < BRIEF_LINES.length;

  useEffect(() => {
    if (!revealing) { onReady?.(); return undefined; }
    const timer = setTimeout(() => setShown(shown + 1), shown === 0 ? 950 : 620);
    return () => clearTimeout(timer);
  }, [shown, revealing, onReady]);

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : null;

  return (
    <motion.section
      className="nt-brief"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .85, ease: EASE }}
      aria-labelledby="nt-brief-title"
    >
      <span className="nt-brief-glow" aria-hidden="true" />

      <header className="nt-brief-head">
        <motion.span
          className="nt-brief-mark"
          initial={{ opacity: 0, scale: .82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .65, ease: EASE }}
        >
          <motion.i
            className="bi bi-bell"
            animate={revealing ? { rotate: [0, -12, 10, -6, 0] } : { rotate: 0 }}
            transition={revealing ? { duration: 1.6, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' } : { duration: .4 }}
            aria-hidden="true"
          />
          {unreadCount > 0 && <span className="nt-brief-count">{unreadCount}</span>}
        </motion.span>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .2, ease: EASE }}>
          <p className="nt-eyebrow">Notification centre</p>
          <h2 id="nt-brief-title">{greetingFor(new Date().getHours())}{firstName ? `, ${firstName}` : ''}.</h2>
          <p className="nt-brief-sub">Here’s what changed since your last visit.</p>
        </motion.div>
      </header>

      <ol className="nt-brief-list" aria-live="polite">
        <motion.span
          className="nt-brief-rail"
          aria-hidden="true"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: revealing ? shown / BRIEF_LINES.length : 1 }}
          transition={{ duration: .5, ease: EASE }}
        />
        <AnimatePresence initial={false}>
          {BRIEF_LINES.slice(0, shown).map((line) => (
            <motion.li
              key={line.id}
              initial={{ opacity: 0, x: -12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: .5, ease: EASE }}
            >
              <button type="button" onClick={() => onJump?.(line.target)}>
                <span className="nt-brief-dot" aria-hidden="true" />
                <span>{line.text}</span>
                <em>Show <i className="bi bi-arrow-right" aria-hidden="true" /></em>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </motion.section>
  );
}
