import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';

const EASE = [.16, 1, .3, 1];
const RADIUS = 72;

// Same shape and timing as the Inventory and Product briefs, so the three
// intelligence pages read as one system.
export default function SupplierIntelligence({ intelligence, onInsight, onReady }) {
  const [shown, setShown] = useState(0);
  const score = useCountUp(intelligence.healthScore, { duration: 1800, delay: 320 });
  const lines = intelligence.lines;
  const analysing = shown < lines.length;

  useEffect(() => {
    if (!analysing) { onReady?.(); return undefined; }
    const timer = setTimeout(() => setShown(shown + 1), shown === 0 ? 1100 : 760);
    return () => clearTimeout(timer);
  }, [shown, analysing, onReady]);

  return (
    <motion.section
      className="sp-hero"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .85, ease: EASE }}
      whileHover={{ y: -3, transition: { duration: .3, ease: 'easeOut' } }}
      aria-labelledby="sp-hero-title"
    >
      <span className="sp-hero-glow" aria-hidden="true" />

      <div className="sp-hero-score">
        <div className="sp-gauge">
          <svg viewBox="0 0 170 170" role="img" aria-label={`Supply health ${intelligence.healthScore} out of 100`}>
            <circle className="sp-gauge-track" cx="85" cy="85" r={RADIUS} />
            <motion.circle
              className="sp-gauge-arc"
              cx="85" cy="85" r={RADIUS}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: intelligence.healthScore / 100 }}
              transition={{ duration: 1.8, delay: .32, ease: EASE }}
            />
          </svg>
          <div className="sp-gauge-value">
            <strong>{Math.round(score)}</strong>
            <span>supply health</span>
          </div>
        </div>

        <div className="sp-hero-mini">
          <span><b>{intelligence.preferred}</b>preferred</span>
          <span><b>{intelligence.needsAttention}</b>need attention</span>
        </div>
      </div>

      <div className="sp-hero-brief">
        <header>
          <span className="sp-hero-mark">
            <motion.i
              className="bi bi-robot"
              animate={analysing ? { scale: [1, 1.12, 1], opacity: [.75, 1, .75] } : { scale: 1, opacity: 1 }}
              transition={analysing ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : { duration: .4 }}
              aria-hidden="true"
            />
          </span>
          <div>
            <p className="sp-eyebrow">Supplier Intelligence</p>
            <h2 id="sp-hero-title">
              {analysing ? 'Analyzing supplier performance…' : 'Here is who you can rely on.'}
            </h2>
          </div>
        </header>

        <ul className="sp-brief-lines" aria-live="polite">
          <AnimatePresence initial={false}>
            {lines.slice(0, shown).map((line) => (
              <motion.li
                key={line.id}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: .55, ease: EASE }}
              >
                <button type="button" onClick={() => onInsight?.(line)}>
                  <i className="bi bi-check-lg" aria-hidden="true" />
                  <span>{line.text}</span>
                  <em>Show <i className="bi bi-arrow-right" aria-hidden="true" /></em>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
          {analysing && (
            <motion.li className="sp-brief-typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-hidden="true">
              <span /><span /><span />
            </motion.li>
          )}
        </ul>
      </div>
    </motion.section>
  );
}
