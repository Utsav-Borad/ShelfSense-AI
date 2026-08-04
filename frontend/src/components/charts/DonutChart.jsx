import { motion } from 'framer-motion';
import { CHART_EASE } from './chartUtils';

// Each slice is an arc of the same circle, offset by everything before it, and
// drawn in sequence with pathLength.
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DonutChart({ segments = [], centerLabel, centerValue }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  let offset = 0;

  return (
    <div className="chart-donut">
      <svg viewBox="0 0 110 110" role="img" aria-label="Share by category">
        <circle className="donut-track" cx="55" cy="55" r={RADIUS} />
        {segments.map((segment, index) => {
          const share = segment.value / total;
          const dash = share * CIRCUMFERENCE;
          const rotation = (offset / total) * 360;
          offset += segment.value;
          return (
            <motion.circle
              key={segment.label}
              cx="55" cy="55" r={RADIUS}
              className={`donut-slice tone-${segment.tone}`}
              strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
              style={{ transform: `rotate(${rotation - 90}deg)`, transformOrigin: '55px 55px' }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: .9, delay: index * .16, ease: CHART_EASE }}
            />
          );
        })}
      </svg>
      <div className="donut-center">
        <strong>{centerValue}</strong>
        <small>{centerLabel}</small>
      </div>
    </div>
  );
}
