import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AreaChart, BarChart, DonutChart, LineChart } from '../../components/charts';
import {
  AiExplainDrawer, AnalyticsIntelligence, ChartPanel, TimeRange,
} from '../../components/analytics';
import {
  toBriefLines, toCategorySplit, toCharts, toRevenueSeries,
  toSalesSeries, toSupplierShares,
} from '../../components/analytics/fromApi';
import ErrorState from '../../components/ui/ErrorState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import {
  getCategoryAnalytics, getDashboard, getRevenue,
  getSupplierAnalytics, getTrends,
} from '../../services/analyticsService';
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
  const [range, setRange] = useState('monthly');
  const [failed, setFailed] = useState('');
  const [raw, setRaw] = useState(null);
  const [active, setActive] = useState(null);   // hover-explained chart
  const [flashed, setFlashed] = useState(null); // chart jumped to from the brief
  const [asked, setAsked] = useState(null);     // chart open in the drawer

  // The five aggregation endpoints this page draws from. Fetched once; the
  // range selector trims the returned series rather than refetching.
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [revenue, trends, categories, suppliers, dashboard] = await Promise.all([
          getRevenue(), getTrends(), getCategoryAnalytics(),
          getSupplierAnalytics(), getDashboard(),
        ]);
        if (!active) return;
        setRaw({
          revenue: revenue.data,
          trends: trends.data,
          categories: categories.data,
          suppliers: suppliers.data,
          summary: dashboard.data,
        });
      } catch (failure) {
        if (active) setFailed(failure.detail || 'We could not load your analytics.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  // Step the reveal counter so each panel lands after the one before it.
  useEffect(() => {
    if (loading || revealed >= charts.length) return undefined;
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


  // Everything the page draws, derived from one fetch plus the chosen range.
  const revenueSeries = raw ? toRevenueSeries(raw.revenue, range) : null;
  const salesSeries = raw ? toSalesSeries(raw.trends, range) : null;
  const categorySplit = raw ? toCategorySplit(raw.categories) : null;
  const supplierShares = raw ? toSupplierShares(raw.suppliers) : null;
  const charts = raw
    ? toCharts(revenueSeries, salesSeries, categorySplit, supplierShares, raw.summary)
    : [];
  const briefLines = raw
    ? toBriefLines(raw.revenue, raw.trends, raw.categories, raw.summary)
    : [];
  const health = raw && raw.summary.analysed_products
    ? Math.round(((raw.summary.health_mix.HEALTHY || 0) / raw.summary.analysed_products) * 100)
    : 0;

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
        return <LineChart key={key} id={key} values={revenueSeries.values} labels={revenueSeries.labels} tone="gold" />;
      case 'sales':
        return <BarChart key={key} values={salesSeries.values} labels={salesSeries.labels} />;
      case 'category':
        return (
          <div className="an-donut-row" key={key}>
            <DonutChart
              segments={categorySplit.segments}
              centerValue={categorySplit.headline}
              centerLabel={categorySplit.leader ? `${categorySplit.leader} leads` : 'No sales yet'}
            />
            <ul className="an-legend">
              {categorySplit.segments.map((segment) => (
                <li key={segment.label}>
                  <i className={`tone-${segment.tone}`} aria-hidden="true" />
                  {segment.label}<b>{segment.value}%</b>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'supplier':
        return <BarChart key={key} values={supplierShares.values} labels={supplierShares.labels} highlightLast={false} />;
      default:
        return null;
    }
  }

  if (loading) {
    return <div className="an"><LoadingSpinner label="Reading your analytics" /></div>;
  }

  if (failed) {
    return (
      <div className="an">
        <ErrorState title="We could not load your analytics" description={failed} />
      </div>
    );
  }

  return (
    <div className={`an${explaining ? ' is-explaining' : ''}`}>
      <AnalyticsIntelligence lines={briefLines} health={health} onInsight={jumpToChart} onReady={() => setReady(true)} />

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
                {charts.map((chart) => (
                  <ChartPanel
                    key={chart.id}
                    chart={chart}
                    revealed={revealed > chart.order}
                    isActive={active === chart.id}
                    isDimmed={Boolean(explaining) && explaining !== chart.id}
                    isFlashed={flashed === chart.id}
                    onExplainStart={setActive}
                    onExplainEnd={(id) => setActive((current) => (current === id ? null : current))}
                    onAsk={(target) => { setActive(null); setAsked(charts.find((chart) => chart.id === target.id)); }}
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
