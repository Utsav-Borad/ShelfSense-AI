import { motion } from 'framer-motion';
import ConfidenceRing from './ConfidenceRing';
import { PRIORITY_META } from './data';

const EASE = [.16, 1, .3, 1];

export default function RecommendationCard({
  recommendation, index, revealed, isFocused, isCompleted, isDismissed,
  onAccept, onDismiss, onLearnMore,
}) {
  const meta = PRIORITY_META[recommendation.priority];

  return (
    <motion.article
      id={`rec-${recommendation.id}`}
      className={`ai-rec tone-${meta.tone}${isFocused ? ' is-focused' : ''}${isCompleted ? ' is-completed' : ''}${isDismissed ? ' is-dismissed' : ''}`}
      initial={{ opacity: 0, y: 28 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: .7, delay: revealed ? index * .06 : 0, ease: EASE }}
      whileHover={isCompleted ? undefined : { y: -4, transition: { duration: .28, ease: 'easeOut' } }}
      layout
    >
      <span className="ai-sweep" aria-hidden="true" />

      <header className="ai-rec-head">
        <span className="ai-rec-icon"><i className={`bi ${recommendation.icon}`} aria-hidden="true" /></span>

        {/* Pulses once as it arrives, then stays still. */}
        <motion.span
          className={`ai-priority tone-${meta.tone}`}
          initial={{ scale: .9 }}
          animate={revealed ? { scale: [0.9, 1.1, 1] } : { scale: .9 }}
          transition={{ duration: .8, delay: .2 + index * .06, ease: EASE }}
        >
          <i className={`bi ${meta.icon}`} aria-hidden="true" />{meta.label}
        </motion.span>

        <span className="ai-rec-category">{recommendation.category}</span>
        <ConfidenceRing value={recommendation.confidence} delay={.35 + index * .06} />
      </header>

      <h3>{recommendation.title}</h3>

      <dl className="ai-rec-rows">
        <div><dt>Business reason</dt><dd>{recommendation.reason}</dd></div>
        <div><dt>Expected impact</dt><dd>{recommendation.impact}</dd></div>
      </dl>

      <div className="ai-rec-meta">
        <span className="ai-chip"><i className="bi bi-calendar-event" aria-hidden="true" />{recommendation.timeline}</span>
        <span className="ai-chip is-value"><i className="bi bi-cash-stack" aria-hidden="true" />₹{recommendation.impactValue.toLocaleString('en-IN')}</span>
      </div>

      <footer className="ai-rec-actions">
        {isCompleted ? (
          <motion.span
            className="ai-done"
            initial={{ opacity: 0, scale: .95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: .4, ease: EASE }}
          >
            <i className="bi bi-check-circle-fill" aria-hidden="true" />Accepted
          </motion.span>
        ) : isDismissed ? (
          <span className="ai-dismissed"><i className="bi bi-slash-circle" aria-hidden="true" />Dismissed</span>
        ) : (
          <>
            <button type="button" className="ai-btn ai-btn-primary" onClick={() => onAccept(recommendation.id)}>
              <i className="bi bi-check-lg" aria-hidden="true" />Accept
            </button>
            <button type="button" className="ai-btn ai-btn-ghost" onClick={() => onDismiss(recommendation.id)}>
              Dismiss
            </button>
            <button type="button" className="ai-btn ai-btn-quiet" onClick={() => onLearnMore(recommendation)}>
              Learn more <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>
          </>
        )}
      </footer>
    </motion.article>
  );
}
