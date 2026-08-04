import { motion } from 'framer-motion';
import { CHART_EASE, VIEW, scalePoints, toAreaPath, toSmoothPath } from './chartUtils';

// Line + soft area. The stroke draws itself, then the fill and the points fade
// in behind it.
export default function LineChart({ values = [], labels = [], tone = 'gold', id = 'line' }) {
  const points = scalePoints(values);
  const gradientId = `${id}-fill`;

  return (
    <div className="chart-frame">
      <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} preserveAspectRatio="none" className={`chart-svg tone-${tone}`} role="img" aria-label={`Trend across ${values.length} points`}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".28" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((n) => (
          <line key={n} className="chart-grid" x1="0" x2={VIEW.width} y1={(VIEW.height / 4) * n + 8} y2={(VIEW.height / 4) * n + 8} vectorEffect="non-scaling-stroke" />
        ))}

        <motion.path
          d={toAreaPath(points)}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: .8, delay: .55, ease: CHART_EASE }}
        />
        <motion.path
          d={toSmoothPath(points)}
          className="chart-line"
          fill="none"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: CHART_EASE }}
        />
        {points.map((point, index) => (
          <motion.circle
            key={point.x}
            cx={point.x}
            cy={point.y}
            r="3"
            className="chart-dot"
            vectorEffect="non-scaling-stroke"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: .34, delay: .5 + index * .07, ease: CHART_EASE }}
          />
        ))}
      </svg>
      {labels.length > 0 && <div className="chart-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div>}
    </div>
  );
}
