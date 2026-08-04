import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AreaChart, BarChart, DonutChart, LineChart } from '../../components/charts';
import {
  AiExplainDrawer, AnalyticsIntelligence, CATEGORY_SPLIT, CHARTS, ChartPanel,
  HEADLINES, LABELS, SERIES, SUPPLIER_SCORES, TimeRange, getChart,
} from '../../components/analytics';
import '../../styles/analytics.css';

const EASE = [.16, 1, .3, 1];

// Charts arrive one at a time rather than together, in the order the brief
// asks for: revenue, sales, turnover, category, supplier, then the two risk
// charts, then the forecast last.
const REVEAL_STEP = 380;

function ChartSkeleton() {
  return (
    <div className="an-skeletons" aria-busy="true" aria-label="Loading analytics">
      {[0, 1, 2, 3].map((n) => <span className="an-sk" key={n} />)}
    </div>
  );
}

export default function AnalyticsPage() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(0);
  const [range, setRange] = useState('week');
  const [active, setActive] = useState(null);   // hover-explained chart
  const [flashed, setFlashed] = useState(null); // chart jumped to from the brief
  const [asked, setAsked] = useState(null);     // chart open in the drawer

  // Placeholder settle once the brief has finished.
  useEffect(() => {
    if (!ready) return undefined;
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [ready]);

  // Step the reveal counter so each panel lands after the one before it.
  useEffect(() => {
    if (loading || revealed >= CHARTS.length) return undefined;
    const timer = setTimeout(() => setRevealed(revealed + 1), REVEAL_STEP);
    return () => clearTimeout(timer);
  }, [loading, revealed]);

  // Clear the brief's highlight after a moment so it reads as a flash, not a
  // permanent selection.
  useEffect(() => {
    if (!flashed) return undefined;
    const timer = setTimeout(() => setFlashed(null), 2200);
    return () => clearTimeout(timer);
  }, [flashed]);

  const series = SERIES[range];
  const labels = LABELS[range];
  const headline = HEADLINES[range];

  function jumpToChart(id) {
    setFlashed(id);
    document.getElementById(`chart-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Explain mode is on whenever a card is showing or the drawer is open.
  const explaining = active || asked?.id || null;

  // The chart body for each panel. Keyed by range so switching the time range
  // remounts the chart and it draws itself again.
  function renderChart(chart) {
    const key = `${chart.id}-${range}`;
    switch (chart.id) {
      case 'revenue':
        return <LineChart key={key} id={key} values={series.revenue} labels={labels} tone="gold" />;
      case 'sales':
        return <BarChart key={key} values={series.sales} labels={labels} />;
      case 'turnover':
        return <AreaChart key={key} id={key} values={series.turnover} compare={series.turnoverCompare} labels={labels} />;
      case 'category':
        return (
          <div className="an-donut-row" key={key}>
            <DonutChart segments={CATEGORY_SPLIT} centerValue="34%" centerLabel="Dairy leads" />
            <ul className="an-legend">
              {CATEGORY_SPLIT.map((segment) => (
                <li key={segment.label}>
                  <i className={`tone-${segment.tone}`} aria-hidden="true" />
                  {segment.label}<b>{segment.value}%</b>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'supplier':
        return <BarChart key={key} values={SUPPLIER_SCORES.values} labels={SUPPLIER_SCORES.labels} highlightLast={false} />;
      case 'dead':
        return <LineChart key={key} id={key} values={series.deadStock} labels={labels} tone="olive" />;
      case 'expiry':
        return <BarChart key={key} values={series.nearExpiry} labels={labels} />;
      case 'forecast':
        return <AreaChart key={key} id={key} values={series.forecast} compare={series.forecastCompare} labels={labels} />;
      default:
        return null;
    }
  }

  const headlineFor = (chart) => (chart.metric ? headline[chart.metric] : null);

  return (
    <div className={`an${explaining ? ' is-explaining' : ''}`}>
      <AnalyticsIntelligence onInsight={jumpToChart} onReady={() => setReady(true)} />

      <AnimatePresence>
        {ready && (
          <motion.div
            className="an-reveal"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, ease: EASE }}
          >
            <div className={`an-controls-wrap${explaining ? ' is-dimmed' : ''}`}>
              <TimeRange range={range} onRange={(next) => { setRange(next); setActive(null); }} />
            </div>

            {loading ? <ChartSkeleton /> : (
              <div className="an-grid">
                {CHARTS.map((chart) => (
                  <ChartPanel
                    key={chart.id}
                    chart={{ ...chart, headline: headlineFor(chart) }}
                    revealed={revealed > chart.order}
                    isActive={active === chart.id}
                    isDimmed={Boolean(explaining) && explaining !== chart.id}
                    isFlashed={flashed === chart.id}
                    onExplainStart={setActive}
                    onExplainEnd={(id) => setActive((current) => (current === id ? null : current))}
                    onAsk={(target) => { setActive(null); setAsked(getChart(target.id)); }}
                  >
                    {renderChart(chart)}
                  </ChartPanel>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AiExplainDrawer chart={asked} onClose={() => setAsked(null)} />
    </div>
  );
}
