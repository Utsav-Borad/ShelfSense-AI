import { motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';

const EASE = [.16, 1, .3, 1];
const RADIUS = 19;

export default function ConfidenceRing({ value, delay = 0, size = 'md', label }) {
  const shown = useCountUp(value, { duration: 1200, delay: delay * 1000 });
  const tone = value >= 90 ? 'success' : value >= 75 ? 'olive' : 'warning';

  return (
    <span className={`ai-ring is-${size} tone-${tone}`} aria-label={`AI confidence ${value} percent`}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className="ai-ring-track" cx="24" cy="24" r={RADIUS} />
        <motion.circle
          className="ai-ring-arc"
          cx="24" cy="24" r={RADIUS}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: 1.2, delay, ease: EASE }}
        />
      </svg>
      <b>{Math.round(shown)}<i>%</i></b>
      {label && <em>{label}</em>}
    </span>
  );
}
