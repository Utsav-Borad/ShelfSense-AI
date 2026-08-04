import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RECOMMENDATIONS } from './data';

const EASE = [.16, 1, .3, 1];
const RADIUS = 20;

// Every recommendation carries its priority, confidence, reasoning, expected
// impact and the action it suggests — the documented output shape.
function ConfidenceRing({ value, delay }) {
  return (
    <span className="dash-ring" aria-label={`${value}% confidence`}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className="dash-ring-track" cx="24" cy="24" r={RADIUS} />
        <motion.circle
          className="dash-ring-arc"
          cx="24" cy="24" r={RADIUS}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: 1.2, delay, ease: EASE }}
        />
      </svg>
      <b>{value}<i>%</i></b>
    </span>
  );
}

export default function Recommendations() {
  return (
    <section className="dash-recs" aria-label="AI recommendations">
      <header className="dash-section-head">
        <div>
          <p className="dash-eyebrow">AI recommendations</p>
          <h2>What to do next</h2>
        </div>
        <Link to="/ai-insights" className="dash-link">All insights <i className="bi bi-arrow-right" aria-hidden="true" /></Link>
      </header>

      <div className="dash-rec-grid">
        {RECOMMENDATIONS.map((rec, index) => (
          <motion.article
            key={rec.id}
            className={`dash-card dash-rec tone-${rec.tone}`}
            initial={{ opacity: 0, y: 28, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: .75, delay: .14 + index * .12, ease: EASE }}
            whileHover={{ y: -6, transition: { duration: .3, ease: 'easeOut' } }}
          >
            <span className="dash-sweep" aria-hidden="true" />
            <header className="dash-rec-head">
              <motion.span
                className="dash-rec-icon"
                whileHover={{ rotate: -8, scale: 1.06 }}
                transition={{ duration: .3, ease: 'easeOut' }}
              >
                <i className={`bi ${rec.icon}`} aria-hidden="true" />
              </motion.span>
              <span className={`dash-priority is-${rec.priority.toLowerCase()}`}>{rec.priority} priority</span>
              <ConfidenceRing value={rec.confidence} delay={.4 + index * .12} />
            </header>

            <h3>{rec.title}</h3>

            <dl className="dash-rec-rows">
              <div><dt>Why</dt><dd>{rec.reason}</dd></div>
              <div><dt>Expected impact</dt><dd>{rec.impact}</dd></div>
              <div><dt>Suggested action</dt><dd>{rec.action}</dd></div>
            </dl>

            <footer className="dash-rec-foot">
              <span className="dash-advisory"><i className="bi bi-hand-index-thumb" aria-hidden="true" />Advisory — you decide</span>
            </footer>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
