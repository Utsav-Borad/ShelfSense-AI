import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';
import { ASSESSMENT, HEALTH, SUMMARY_METRICS } from './data';

const EASE = [.16, 1, .3, 1];
const RADIUS = 70;

// One metric line. Counts up as it arrives rather than appearing finished.
function Metric({ metric, index }) {
  const value = useCountUp(metric.value, { duration: 1200, delay: 120 });

  return (
    <motion.li
      className={`rp-metric tone-${metric.tone}`}
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: .55, ease: EASE }}
    >
      <span className="rp-metric-icon"><i className={`bi ${metric.icon}`} aria-hidden="true" /></span>
      <span className="rp-metric-label">{metric.label}</span>
      <b>{metric.prefix}{Math.round(value).toLocaleString('en-IN')}{metric.suffix}</b>
      {metric.note && <em>{metric.note}</em>}
      <span className="rp-metric-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
    </motion.li>
  );
}

// Types the assessment out two characters at a time — quick enough not to test
// anyone's patience, slow enough to read as written rather than pasted.
function TypedAssessment({ active }) {
  const [count, setCount] = useState(0);
  const done = count >= ASSESSMENT.length;

  useEffect(() => {
    if (!active || done) return undefined;
    const timer = setTimeout(() => setCount((current) => Math.min(current + 2, ASSESSMENT.length)), 16);
    return () => clearTimeout(timer);
  }, [active, count, done]);

  if (!active) return null;

  return (
    <motion.blockquote
      className="rp-assessment"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .5, ease: EASE }}
    >
      <span className="rp-assessment-label">Overall assessment</span>
      <p>
        “{ASSESSMENT.slice(0, count)}
        {!done && <span className="rp-caret" aria-hidden="true" />}
        {done && '”'}
      </p>
    </motion.blockquote>
  );
}

export default function ExecutiveSummary({ onReady }) {
  const [shown, setShown] = useState(0);
  const score = useCountUp(HEALTH.score, { duration: 1700, delay: 300 });
  const revealing = shown < SUMMARY_METRICS.length;

  useEffect(() => {
    if (!revealing) return undefined;
    const timer = setTimeout(() => setShown(shown + 1), shown === 0 ? 900 : 620);
    return () => clearTimeout(timer);
  }, [shown, revealing]);

  // The report categories wait until the assessment has started typing.
  useEffect(() => {
    if (revealing) return undefined;
    const timer = setTimeout(() => onReady?.(), 900);
    return () => clearTimeout(timer);
  }, [revealing, onReady]);

  return (
    <motion.section
      className="rp-summary"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .85, ease: EASE }}
      aria-labelledby="rp-summary-title"
    >
      <span className="rp-summary-glow" aria-hidden="true" />

      <div className="rp-summary-score">
        <div className="rp-gauge">
          <svg viewBox="0 0 164 164" role="img" aria-label={`Business health ${HEALTH.score} out of 100`}>
            <circle className="rp-gauge-track" cx="82" cy="82" r={RADIUS} />
            <motion.circle
              className="rp-gauge-arc"
              cx="82" cy="82" r={RADIUS}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: HEALTH.score / 100 }}
              transition={{ duration: 1.7, delay: .3, ease: EASE }}
            />
          </svg>
          <div className="rp-gauge-value">
            <strong>{Math.round(score)}</strong>
            <span>/100</span>
          </div>
        </div>
        <p className="rp-verdict"><span className="rp-dot" aria-hidden="true" />Business health: <b>{HEALTH.status}</b></p>
      </div>

      <div className="rp-summary-body">
        <header>
          <span className="rp-summary-mark"><i className="bi bi-file-earmark-text" aria-hidden="true" /></span>
          <div>
            <p className="rp-eyebrow">Executive summary</p>
            <h2 id="rp-summary-title">This month’s performance</h2>
          </div>
        </header>

        <ul className="rp-metrics" aria-live="polite">
          <AnimatePresence initial={false}>
            {SUMMARY_METRICS.slice(0, shown).map((metric, index) => (
              <Metric key={metric.id} metric={metric} index={index} />
            ))}
          </AnimatePresence>
        </ul>

        <TypedAssessment active={!revealing} />
      </div>
    </motion.section>
  );
}
