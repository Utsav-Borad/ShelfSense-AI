import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ActivityTimeline, AiBrief, ChartsSection, DashboardSkeleton, Greeting,
  HealthHero, InventoryHealth, KpiGrid, QuickActions, Recommendations, TopProducts,
} from '../../components/dashboard';
import {
  toAlerts, toBriefLines, toDemandSplit, toHealth, toInventoryHealth,
  toKpis, toRecommendations, toRevenueBars, toSalesTrend, toTopProducts,
} from '../../components/dashboard/fromApi';
import ErrorState from '../../components/ui/ErrorState';
import {
  getDashboard, getInventoryAnalytics, getRevenue, getTrends,
} from '../../services/analyticsService';
import { getRecommendations } from '../../services/aiService';
import { getNotifications } from '../../services/notificationsService';
import { getReport } from '../../services/reportsService';
import '../../styles/dashboard.css';

// A few motionless particles over a soft warm glow. Purely atmosphere — the
// layer never intercepts a click.
const PARTICLES = [[9, 18], [24, 62], [38, 12], [52, 78], [66, 34], [79, 68], [91, 22], [46, 44]];

function Atmosphere() {
  return (
    <div className="dash-atmosphere" aria-hidden="true">
      <span className="dash-glow" />
      {PARTICLES.map(([x, y], index) => (
        <motion.i
          key={index}
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={{ y: [0, index % 2 ? -10 : 8, 0], opacity: [.07, .16, .07] }}
          transition={{ duration: 20 + (index % 4) * 5, repeat: Infinity, ease: 'easeInOut', delay: index * .8 }}
        />
      ))}
    </div>
  );
}

// Order is the argument: health and the brief come first and biggest, then the
// numbers, then the analysis, then what to do about it.
export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState(null);

  // One pass over the six endpoints the Decision Center needs. They are
  // independent, so they run together and the page renders once they all land.
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [dashboard, revenue, trends, inventory, ai, report, alerts] = await Promise.all([
          getDashboard(),
          getRevenue(),
          getTrends(),
          getInventoryAnalytics(),
          getRecommendations(),
          getReport('monthly'),
          getNotifications(),
        ]);
        if (!active) return;

        const summary = dashboard.data;
        const advice = ai.data.recommendations;

        setView({
          analysed: summary.analysed_products,
          health: toHealth(summary),
          brief: toBriefLines(summary, advice),
          kpis: toKpis(summary),
          salesTrend: toSalesTrend(trends.data),
          revenueBars: toRevenueBars(revenue.data),
          demandSplit: toDemandSplit(trends.data),
          inventoryHealth: toInventoryHealth(inventory.data, summary),
          topProducts: toTopProducts(report.data),
          recommendations: toRecommendations(advice),
          alerts: toAlerts(alerts.data.notifications),
        });
      } catch (failure) {
        if (active) setError(failure.detail || 'We could not load your dashboard.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    // Stops a late response from writing to a page the user has already left.
    return () => { active = false; };
  }, []);

  if (!loading && error) {
    return (
      <div className="dash">
        <Atmosphere />
        <Greeting />
        <ErrorState title="We could not load your dashboard" description={error} />
      </div>
    );
  }

  return (
    <div className="dash">
      <Atmosphere />

      <AnimatePresence mode="wait" initial={false}>
        {loading || !view ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
            <DashboardSkeleton />
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .4 }}>
            <Greeting analysed={view.analysed} />

            {/* 1 + 2 — the two things that should be read first. */}
            <div className="dash-hero-row">
              <HealthHero health={view.health} />
              <AiBrief lines={view.brief} />
            </div>

            {/* 3 */}
            <KpiGrid items={view.kpis} />

            {/* 4 */}
            <ChartsSection
              salesTrend={view.salesTrend}
              revenueBars={view.revenueBars}
              demandSplit={view.demandSplit}
            />

            {/* 5 */}
            <div className="dash-insight-row">
              <InventoryHealth items={view.inventoryHealth} />
              <TopProducts items={view.topProducts} />
            </div>

            {/* 6 */}
            <Recommendations items={view.recommendations} />

            {/* 7 */}
            <div className="dash-closing-row">
              <ActivityTimeline events={view.alerts} />
              <div className="dash-quick-wrap">
                <header className="dash-section-head">
                  <div>
                    <p className="dash-eyebrow">Quick actions</p>
                    <h2>Common next steps</h2>
                  </div>
                </header>
                <QuickActions />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
