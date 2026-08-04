import { motion } from 'framer-motion';
import { CHART_EASE, scalePoints, toSmoothPath } from './chartUtils';

// The small trend line inside a KPI card.
export default function Sparkline({ values = [], tone = 'olive', delay = 0 }) {
  const points = scalePoints(values, { width: 100, height: 28, padY: 4 });

  return (
    <svg viewBox="0 0 100 28" preserveAspectRatio="none" className={`sparkline tone-${tone}`} aria-hidden="true">
      <motion.path
        d={toSmoothPath(points)}
        fill="none"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, delay, ease: CHART_EASE }}
      />
    </svg>
  );
}
