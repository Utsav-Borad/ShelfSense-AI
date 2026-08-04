import { motion } from 'framer-motion';
import { CHART_EASE, VIEW, scalePoints, toAreaPath, toSmoothPath } from './chartUtils';

// Two stacked series — the filled band wipes upward while the outline draws.
export default function AreaChart({ values = [], compare = [], labels = [], id = 'area' }) {
  const points = scalePoints(values);
  const comparePoints = compare.length ? scalePoints(compare) : [];
  const gradientId = `${id}-fill`;

  return (
    <div className="chart-frame">
      <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} preserveAspectRatio="none" className="chart-svg tone-olive" role="img" aria-label="Inventory value over time">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity=".34" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`${id}-wipe`}>
            <motion.rect
              x="0" y="0" width={VIEW.width} height={VIEW.height}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: 'left center' }}
              transition={{ duration: 1.4, ease: CHART_EASE }}
            />
          </clipPath>
        </defs>

        {[0, 1, 2, 3].map((n) => (
          <line key={n} className="chart-grid" x1="0" x2={VIEW.width} y1={(VIEW.height / 4) * n + 8} y2={(VIEW.height / 4) * n + 8} vectorEffect="non-scaling-stroke" />
        ))}

        <g clipPath={`url(#${id}-wipe)`}>
          <path d={toAreaPath(points)} fill={`url(#${gradientId})`} />
          <path d={toSmoothPath(points)} className="chart-line" fill="none" vectorEffect="non-scaling-stroke" />
          {comparePoints.length > 0 && (
            <path d={toSmoothPath(comparePoints)} className="chart-line is-compare" fill="none" vectorEffect="non-scaling-stroke" />
          )}
        </g>
      </svg>
      {labels.length > 0 && <div className="chart-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div>}
    </div>
  );
}
