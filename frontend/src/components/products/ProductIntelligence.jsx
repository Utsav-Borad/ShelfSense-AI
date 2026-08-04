import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';

const EASE = [.16, 1, .3, 1];
const RADIUS = 72;

// Mirrors the Inventory Intelligence hero deliberately — same rhythm, same
// weights — so moving between the two pages feels like one product.
export default function ProductIntelligence({ intelligence, onInsight, onReady }) {
  const [shown, setShown] = useState(0);
  const score = useCountUp(intelligence.averageScore, { duration: 1800, delay: 320 });
  const lines = intelligence.lines;
  const analysing = shown < lines.length;

  useEffect(() => {
    if (!analysing) { onReady?.(); return undefined; }
    const timer = setTimeout(() => setShown(shown + 1), shown === 0 ? 1100 : 760);
    return () => clearTimeout(timer);
  }, [shown, analysing, onReady]);

  return (
    <motion.section
      className="pi-hero"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .85, ease: EASE }}
      whileHover={{ y: -3, transition: { duration: .3, ease: 'easeOut' } }}
      aria-labelledby="pi-hero-title"
    >
      <span className="pi-hero-glow" aria-hidden="true" />

      <div className="pi-hero-score">
        <div className="pi-gauge">
          <svg viewBox="0 0 170 170" role="img" aria-label={`Average AI product score ${intelligence.averageScore} out of 100`}>
            <circle className="pi-gauge-track" cx="85" cy="85" r={RADIUS} />
            <motion.circle
              className="pi-gauge-arc"
              cx="85" cy="85" r={RADIUS}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: intelligence.averageScore / 100 }}
              transition={{ duration: 1.8, delay: .32, ease: EASE }}
            />
          </svg>
          <div className="pi-gauge-value">
            <strong>{Math.round(score)}</strong>
            <span>avg AI score</span>
          </div>
        </div>

        <div className="pi-hero-mini">
          <span><b>{intelligence.performing}</b>performing</span>
          <span><b>{intelligence.needsAction}</b>need action</span>
        </div>
      </div>

      <div className="pi-hero-brief">
        <header>
          <span className="pi-hero-mark">
            <motion.i
              className="bi bi-robot"
              animate={analysing ? { scale: [1, 1.12, 1], opacity: [.75, 1, .75] } : { scale: 1, opacity: 1 }}
              transition={analysing ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : { duration: .4 }}
              aria-hidden="true"
            />
          </span>
          <div>
            <p className="pi-eyebrow">Product Intelligence</p>
            <h2 id="pi-hero-title">
              {analysing ? 'Analyzing product performance…' : 'Here is how your catalog is doing.'}
            </h2>
          </div>
        </header>

        <ul className="pi-brief-lines" aria-live="polite">
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
            <motion.li className="pi-brief-typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-hidden="true">
              <span /><span /><span />
            </motion.li>
          )}
        </ul>
      </div>
    </motion.section>
  );
}
