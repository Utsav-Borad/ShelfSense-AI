import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ActivityTimeline, AiBrief, ChartsSection, DashboardSkeleton, Greeting,
  HealthHero, InventoryHealth, KpiGrid, QuickActions, Recommendations, TopProducts,
} from '../../components/dashboard';
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

  // Placeholder settle, so the skeleton is a real state rather than decoration.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="dash">
      <Atmosphere />

      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
            <DashboardSkeleton />
          </motion.div>
        ) : (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .4 }}>
            <Greeting />

            {/* 1 + 2 — the two things that should be read first. */}
            <div className="dash-hero-row">
              <HealthHero />
              <AiBrief />
            </div>

            {/* 3 */}
            <KpiGrid />

            {/* 4 */}
            <ChartsSection />

            {/* 5 */}
            <div className="dash-insight-row">
              <InventoryHealth />
              <TopProducts />
            </div>

            {/* 6 */}
            <Recommendations />

            {/* 7 */}
            <div className="dash-closing-row">
              <ActivityTimeline />
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
