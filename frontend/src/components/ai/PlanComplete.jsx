import { motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';
import { ESTIMATED_IMPROVEMENT } from './data';

const EASE = [.16, 1, .3, 1];

// Shown when every recommendation in today's plan has been actioned. A drawn
// check and a settled figure — no confetti.
export default function PlanComplete({ completed, total, onReview }) {
  const improvement = useCountUp(ESTIMATED_IMPROVEMENT, { duration: 1600, delay: 350 });

  return (
    <motion.section
      className="ai-complete"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .8, ease: EASE }}
      aria-live="polite"
    >
      <motion.span
        className="ai-complete-glow"
        animate={{ scale: [1, 1.12, 1], opacity: [.5, .28, .5] }}
        transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <motion.div className="ai-complete-mark" initial={{ scale: .85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .7, ease: EASE }}>
        <svg viewBox="0 0 72 72" aria-hidden="true">
          <motion.circle cx="36" cy="36" r="33" className="ai-complete-ring" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: EASE }} />
          <motion.path d="M22 37.5 L32 47 L51 27" className="ai-complete-check" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .6, delay: .5, ease: EASE }} />
        </svg>
      </motion.div>

      <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .3, ease: EASE }}>
        Today’s AI plan completed
      </motion.h2>

      <motion.dl className="ai-complete-stats" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .42, ease: EASE }}>
        <div>
          <dt>Potential business improvement</dt>
          <dd className="is-primary">+₹{Math.round(improvement).toLocaleString('en-IN')}</dd>
        </div>
        <div>
          <dt>Recommendations completed</dt>
          <dd>{completed} / {total}</dd>
        </div>
      </motion.dl>

      <motion.p className="ai-complete-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5, delay: .6 }}>
        Tomorrow’s brief will account for what you actioned today.
      </motion.p>

      <motion.button
        type="button"
        className="ai-btn ai-btn-ghost"
        onClick={onReview}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: .5, delay: .7 }}
      >
        <i className="bi bi-arrow-up" aria-hidden="true" />Review the decisions
      </motion.button>
    </motion.section>
  );
}
