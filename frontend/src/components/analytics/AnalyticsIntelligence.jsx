import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';

const EASE = [.16, 1, .3, 1];
const RADIUS = 72;

// Fourth in the intelligence family — same rhythm as Inventory, Product and
// Supplier, so the four pages read as one system.
export default function AnalyticsIntelligence({ lines = [], health = 0, onInsight, onReady }) {
  const [shown, setShown] = useState(0);
  const score = useCountUp(health, { duration: 1800, delay: 320 });
  const analysing = shown < lines.length;

  useEffect(() => {
    if (!analysing) { onReady?.(); return undefined; }
    const timer = setTimeout(() => setShown(shown + 1), shown === 0 ? 1100 : 760);
    return () => clearTimeout(timer);
  }, [shown, analysing, onReady]);

  return (
    <motion.section
      className="an-hero"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .85, ease: EASE }}
      whileHover={{ y: -3, transition: { duration: .3, ease: 'easeOut' } }}
      aria-labelledby="an-hero-title"
    >
      <span className="an-hero-glow" aria-hidden="true" />

      <div className="an-hero-score">
        <div className="an-gauge">
          <svg viewBox="0 0 170 170" role="img" aria-label={`Business health ${health} out of 100`}>
            <circle className="an-gauge-track" cx="85" cy="85" r={RADIUS} />
            <motion.circle
              className="an-gauge-arc"
              cx="85" cy="85" r={RADIUS}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: health / 100 }}
              transition={{ duration: 1.8, delay: .32, ease: EASE }}
            />
          </svg>
          <div className="an-gauge-value">
            <strong>{Math.round(score)}<i>%</i></strong>
            <span>business health</span>
          </div>
        </div>

        <div className="an-hero-mini">
          <span><b>+18%</b>revenue</span>
          <span><b>4.1x</b>turnover</span>
        </div>
      </div>

      <div className="an-hero-brief">
        <header>
          <span className="an-hero-mark">
            <motion.i
              className="bi bi-robot"
              animate={analysing ? { scale: [1, 1.12, 1], opacity: [.75, 1, .75] } : { scale: 1, opacity: 1 }}
              transition={analysing ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : { duration: .4 }}
              aria-hidden="true"
            />
          </span>
          <div>
            <p className="an-eyebrow">Business Analytics</p>
            <h2 id="an-hero-title">
              {analysing ? 'Analyzing business trends…' : 'Here is why the numbers moved.'}
            </h2>
          </div>
        </header>

        <ul className="an-brief-lines" aria-live="polite">
          <AnimatePresence initial={false}>
            {lines.slice(0, shown).map((line) => (
              <motion.li
                key={line.id}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: .55, ease: EASE }}
              >
                <button type="button" onClick={() => onInsight?.(line.chart)}>
                  <i className="bi bi-check-lg" aria-hidden="true" />
                  <span>{line.text}</span>
                  <em>See chart <i className="bi bi-arrow-right" aria-hidden="true" /></em>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
          {analysing && (
            <motion.li className="an-brief-typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-hidden="true">
              <span /><span /><span />
            </motion.li>
          )}
        </ul>
      </div>
    </motion.section>
  );
}
