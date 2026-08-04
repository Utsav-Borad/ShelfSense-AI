import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useCountUp from '../dashboard/useCountUp';

const EASE = [.16, 1, .3, 1];
const RADIUS = 76;

// The first thing on the page: a plain-language read of the inventory, so the
// user knows what needs doing before they meet a table.
//
// `onInsight` filters the table by the clicked line; `onReady` tells the page
// the brief has finished so the table can reveal itself underneath.
export default function InventoryIntelligence({ intelligence, onInsight, onReady, onScrollTo }) {
  const [shown, setShown] = useState(0);
  const score = useCountUp(intelligence.score, { duration: 1900, delay: 320 });
  const lines = intelligence.lines;
  const analysing = shown < lines.length;

  useEffect(() => {
    if (!analysing) { onReady?.(); return undefined; }
    const timer = setTimeout(() => setShown(shown + 1), shown === 0 ? 1100 : 760);
    return () => clearTimeout(timer);
  }, [shown, analysing, onReady]);

  return (
    <motion.section
      className="inv-hero"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .85, ease: EASE }}
      whileHover={{ y: -3, transition: { duration: .3, ease: 'easeOut' } }}
      aria-labelledby="inv-hero-title"
    >
      <span className="inv-hero-glow" aria-hidden="true" />

      {/* Left — the score */}
      <div className="inv-hero-score">
        <div className={`inv-gauge tone-${intelligence.tone}`}>
          <svg viewBox="0 0 180 180" role="img" aria-label={`Inventory health score ${intelligence.score} out of 100`}>
            <circle className="inv-gauge-track" cx="90" cy="90" r={RADIUS} />
            <motion.circle
              className="inv-gauge-arc"
              cx="90" cy="90" r={RADIUS}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: intelligence.score / 100 }}
              transition={{ duration: 1.9, delay: .32, ease: EASE }}
            />
          </svg>
          <div className="inv-gauge-value">
            <strong>{Math.round(score)}</strong>
            <span>/100</span>
          </div>
        </div>
        <p className={`inv-hero-verdict tone-${intelligence.tone}`}>
          <span className="inv-dot" aria-hidden="true" />
          Inventory health: <b>{intelligence.status}</b>
        </p>
      </div>

      {/* Right — the brief */}
      <div className="inv-hero-brief">
        <header>
          <span className="inv-hero-mark">
            <motion.i
              className="bi bi-robot"
              animate={analysing ? { scale: [1, 1.12, 1], opacity: [.75, 1, .75] } : { scale: 1, opacity: 1 }}
              transition={analysing ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : { duration: .4 }}
              aria-hidden="true"
            />
          </span>
          <div>
            <p className="inv-eyebrow">Inventory Intelligence</p>
            <h2 id="inv-hero-title">
              {analysing ? 'Analyzing today’s inventory…' : 'Here is what needs you today.'}
            </h2>
          </div>
        </header>

        <ul className="inv-brief-lines" aria-live="polite">
          <AnimatePresence initial={false}>
            {lines.slice(0, shown).map((line) => (
              <motion.li
                key={line.id}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: .55, ease: EASE }}
              >
                <button type="button" onClick={() => onInsight?.(line.filter)}>
                  <i className={`bi ${line.icon}`} aria-hidden="true" />
                  <span>{line.text}</span>
                  <em>Show these <i className="bi bi-arrow-right" aria-hidden="true" /></em>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
          {analysing && (
            <motion.li className="inv-brief-typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-hidden="true">
              <span /><span /><span />
            </motion.li>
          )}
        </ul>

        {/* Buttons appear last, once the brief has finished. */}
        <motion.div
          className="inv-hero-actions"
          initial={{ opacity: 0, y: 10 }}
          animate={analysing ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          transition={{ duration: .55, delay: analysing ? 0 : .15, ease: EASE }}
        >
          <button type="button" className="inv-btn inv-btn-primary" onClick={() => onScrollTo?.('inventory-recommendations')} tabIndex={analysing ? -1 : 0}>
            Review recommendations <i className="bi bi-arrow-right" aria-hidden="true" />
          </button>
          <button type="button" className="inv-btn inv-btn-ghost" onClick={() => onScrollTo?.('inventory-table')} tabIndex={analysing ? -1 : 0}>
            View inventory
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
