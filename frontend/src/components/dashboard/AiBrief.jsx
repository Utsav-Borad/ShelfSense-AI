import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BRIEF_LINES } from './data';

const EASE = [.16, 1, .3, 1];

// Today's brief, revealed a line at a time so it reads as the system working
// something out rather than a paragraph that was always there.
export default function AiBrief() {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= BRIEF_LINES.length) return undefined;
    const timer = setTimeout(() => setShown(shown + 1), shown === 0 ? 900 : 780);
    return () => clearTimeout(timer);
  }, [shown]);

  const thinking = shown < BRIEF_LINES.length;

  return (
    <motion.section
      className="dash-card dash-brief"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .8, delay: .22, ease: EASE }}
    >
      <header className="dash-brief-head">
        <span className="dash-brief-mark">
          <motion.i
            className="bi bi-stars"
            animate={thinking ? { scale: [1, 1.14, 1], opacity: [.75, 1, .75] } : { scale: 1, opacity: 1 }}
            transition={thinking ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : { duration: .4 }}
            aria-hidden="true"
          />
        </span>
        <div>
          <p className="dash-eyebrow">Today’s AI brief</p>
          <h2>{thinking ? 'Reading your business…' : 'One decision needs you today.'}</h2>
        </div>
      </header>

      <ol className="dash-brief-lines" aria-live="polite">
        <AnimatePresence initial={false}>
          {BRIEF_LINES.slice(0, shown).map((line, index) => (
            <motion.li
              key={line}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: .55, ease: EASE }}
              className={index === BRIEF_LINES.length - 1 ? 'is-decision' : ''}
            >
              <span className="dash-brief-bullet" aria-hidden="true" />
              {line}
            </motion.li>
          ))}
        </AnimatePresence>
        {thinking && (
          <motion.li className="dash-brief-typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-hidden="true">
            <span /><span /><span />
          </motion.li>
        )}
      </ol>

      <motion.div
        className="dash-brief-foot"
        initial={{ opacity: 0 }}
        animate={{ opacity: thinking ? 0 : 1 }}
        transition={{ duration: .5, ease: EASE }}
      >
        <Link to="/ai-insights" className="dash-link">
          See all recommendations <i className="bi bi-arrow-right" aria-hidden="true" />
        </Link>
      </motion.div>
    </motion.section>
  );
}
