import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';
import { greetingFor } from './data';

const EASE = [.16, 1, .3, 1];
const RADIUS = 70;

// One brief line. Counts its own figure as it lands, and reads "No critical
// system alerts" rather than "0 critical system alerts" when the value is nil.
function Line({ line }) {
  const value = useCountUp(line.value, { duration: 1100, delay: 120, decimals: line.decimals || 0 });
  const shown = line.value === 0 && line.zeroWord
    ? line.zeroWord
    : `${line.decimals ? value.toFixed(line.decimals) : Math.round(value).toLocaleString('en-IN')}${line.suffix || ''}`;

  return (
    <motion.li
      className={`ad-brief-line tone-${line.tone}`}
      initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: .55, ease: EASE }}
    >
      <span className="ad-brief-icon"><i className={`bi ${line.icon}`} aria-hidden="true" /></span>
      <b>{shown}</b>
      <span>{line.label}</span>
    </motion.li>
  );
}

// `brief` is the platform totals from toBrief(). The ring is catalogue
// coverage — how many registered businesses have imported anything — rather
// than an invented health score, because that is a number the API can answer.
export default function AdminBrief({ brief, onReview, onReady }) {
  const [shown, setShown] = useState(0);
  const lines = brief.lines;
  const score = useCountUp(brief.coverage, { duration: 1700, delay: 300 });
  const revealing = shown < lines.length;

  useEffect(() => {
    if (!revealing) { onReady?.(); return undefined; }
    const timer = setTimeout(() => setShown(shown + 1), shown === 0 ? 900 : 520);
    return () => clearTimeout(timer);
  }, [shown, revealing, onReady]);

  return (
    <motion.section
      className="ad-brief"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .85, ease: EASE }}
      aria-labelledby="ad-brief-title"
    >
      <span className="ad-brief-glow" aria-hidden="true" />

      <div className="ad-brief-score">
        <div className="ad-gauge">
          <svg viewBox="0 0 164 164" role="img" aria-label={`${brief.coverage}% of businesses hold a catalogue`}>
            <circle className="ad-gauge-track" cx="82" cy="82" r={RADIUS} />
            <motion.circle
              className="ad-gauge-arc"
              cx="82" cy="82" r={RADIUS}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: brief.coverage / 100 }}
              transition={{ duration: 1.7, delay: .3, ease: EASE }}
            />
          </svg>
          <div className="ad-gauge-value">
            <strong>{Math.round(score)}</strong>
            <span>%</span>
          </div>
        </div>
        <p className="ad-verdict"><span className="ad-dot" aria-hidden="true" />{brief.coverageLabel}</p>
      </div>

      <div className="ad-brief-body">
        <header>
          <motion.span
            className="ad-brief-mark"
            initial={{ opacity: 0, scale: .82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: .65, ease: EASE }}
          >
            <motion.i
              className="bi bi-shield-check"
              animate={revealing ? { scale: [1, 1.1, 1], opacity: [.75, 1, .75] } : { scale: 1, opacity: 1 }}
              transition={revealing ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : { duration: .4 }}
              aria-hidden="true"
            />
          </motion.span>
          <div>
            <p className="ad-eyebrow">Admin command center</p>
            <h2 id="ad-brief-title">{greetingFor(new Date().getHours())}, Administrator.</h2>
            <p className="ad-brief-sub">Today’s platform summary.</p>
          </div>
        </header>

        <ul className="ad-brief-lines" aria-live="polite">
          <AnimatePresence initial={false}>
            {lines.slice(0, shown).map((line) => <Line key={line.id} line={line} />)}
          </AnimatePresence>
        </ul>

        <AnimatePresence>
          {!revealing && (
            <motion.div
              className="ad-brief-actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .6, delay: .25, ease: EASE }}
            >
              <button type="button" className="ad-btn ad-btn-primary" onClick={onReview}>
                <i className="bi bi-speedometer2" aria-hidden="true" />Review platform
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
