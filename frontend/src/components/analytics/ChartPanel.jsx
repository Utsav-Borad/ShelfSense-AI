import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ConfidenceRing from './ConfidenceRing';

const EASE = [.16, 1, .3, 1];
const HOVER_DELAY = 400; // within the 300–500ms the brief asks for

// One analytics chart, plus its AI Explain behaviour.
//
// Hovering holds for 400ms before the insight card appears, so passing the
// cursor over a chart on the way somewhere else does not fire it. While a card
// is open the page dims everything else — that dimming is owned by the page,
// which is why this component reports its hover state upward rather than
// keeping it private.
export default function ChartPanel({
  chart, children, revealed, isActive, isDimmed, isFlashed,
  onExplainStart, onExplainEnd, onAsk,
}) {
  const [pending, setPending] = useState(false);

  // The delay timer. Cleared if the cursor leaves before it fires.
  useEffect(() => {
    if (!pending) return undefined;
    const timer = setTimeout(() => onExplainStart(chart.id), HOVER_DELAY);
    return () => clearTimeout(timer);
  }, [pending, chart.id, onExplainStart]);

  const deltaGood = chart.invert ? chart.delta < 0 : chart.delta > 0;

  return (
    <motion.section
      id={`chart-${chart.id}`}
      className={`an-panel${isActive ? ' is-active' : ''}${isDimmed ? ' is-dimmed' : ''}${isFlashed ? ' is-flashed' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      animate={revealed ? { opacity: isDimmed ? .6 : 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: .7, ease: EASE }}
      onMouseEnter={() => setPending(true)}
      onMouseLeave={() => { setPending(false); onExplainEnd(chart.id); }}
      aria-labelledby={`chart-title-${chart.id}`}
    >
      <span className="an-sweep" aria-hidden="true" />

      <header className="an-panel-head">
        <div>
          <p className="an-eyebrow">{chart.caption}</p>
          <h3 id={`chart-title-${chart.id}`}>{chart.title}</h3>
        </div>

        <div className="an-panel-meta">
          {chart.headline && (
            <span className="an-headline">
              {chart.headline}
              <em className={deltaGood ? 'is-good' : 'is-bad'}>
                <i className={`bi bi-arrow-${chart.delta > 0 ? 'up' : 'down'}-short`} aria-hidden="true" />
                {Math.abs(chart.delta)}{chart.suffix ? '' : '%'}
              </em>
            </span>
          )}
          <button type="button" className="an-ask" onClick={() => onAsk(chart)}>
            <i className="bi bi-stars" aria-hidden="true" />Ask AI
          </button>
        </div>
      </header>

      <div className="an-chart-slot">{children}</div>

      {/* The hover insight card. */}
      <AnimatePresence>
        {isActive && (
          <motion.aside
            className="an-insight"
            role="status"
            initial={{ opacity: 0, y: 14, scale: .98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: .98 }}
            transition={{ duration: .32, ease: EASE }}
          >
            <header>
              <span className="an-insight-mark"><i className="bi bi-stars" aria-hidden="true" /></span>
              <strong>AI insight</strong>
              <ConfidenceRing value={chart.explain.confidence} delay={.1} size="sm" />
            </header>
            <p className="an-insight-summary">{chart.explain.summary}</p>
            <dl>
              <div><dt>Business reason</dt><dd>{chart.explain.reason}</dd></div>
              <div><dt>Suggested action</dt><dd>{chart.explain.action}</dd></div>
            </dl>
            <button type="button" className="an-insight-more" onClick={() => onAsk(chart)}>
              Ask AI for the full analysis <i className="bi bi-arrow-right" aria-hidden="true" />
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
