import { motion } from 'framer-motion';
import { CHART_EASE } from './chartUtils';

// Bars grow from the baseline, one after another. Built from divs rather than
// SVG so the rounded caps and gradients follow the theme tokens directly.
export default function BarChart({ values = [], labels = [], highlightLast = true }) {
  const max = Math.max(...values) || 1;

  return (
    <div className="chart-frame">
      <div className="chart-bars" role="img" aria-label={`Comparison across ${values.length} periods`}>
        {values.map((value, index) => (
          <span className="chart-bar-slot" key={index}>
            <motion.i
              className={highlightLast && index === values.length - 1 ? 'is-highlight' : ''}
              style={{ height: `${(value / max) * 100}%` }}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: .75, delay: index * .07, ease: CHART_EASE }}
            />
          </span>
        ))}
      </div>
      {labels.length > 0 && <div className="chart-labels">{labels.map((label) => <span key={label}>{label}</span>)}</div>}
    </div>
  );
}
