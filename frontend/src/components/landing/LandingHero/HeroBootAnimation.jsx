import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Scene 3. Everything inside the screen wakes up while the device is still
// rising: sidebar, health score counting 0 -> 92, revenue, a chart that draws
// itself, inventory, notifications, and finally the AI recommendation.

function useCount(target, active, { duration = 1200, delay = 0, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) { setValue(0); return undefined; }
    let frame; let start = null;
    const tick = (now) => {
      if (start === null) start = now;
      const elapsed = now - start - delay;
      if (elapsed < 0) { frame = requestAnimationFrame(tick); return; }
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setValue(Number((target * eased).toFixed(decimals)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration, delay, decimals]);
  return value;
}

// One shared choreography: `custom` is the beat each element enters on.
const beat = {
  hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
  show: (d = 0) => ({ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: .55, delay: d, ease: [.16, 1, .3, 1] } }),
};

const nav = [['bi-grid-1x2-fill', 'Overview'], ['bi-box-seam', 'Inventory'], ['bi-graph-up-arrow', 'Analytics'], ['bi-stars', 'AI insights'], ['bi-truck', 'Suppliers'], ['bi-file-earmark-text', 'Reports']];
const bars = [42, 58, 47, 71, 63, 88, 76];
const alerts = [['bi-clock-history', 'Near expiry', '12 items', 'warn'], ['bi-arrow-down-circle', 'Low stock', '4 items', 'danger'], ['bi-truck', 'Supplier rating', 'A+', 'ok']];

export default function HeroBootAnimation({ booted }) {
  const health = useCount(92, booted, { delay: 340 });
  const revenue = useCount(18.2, booted, { delay: 620, decimals: 1 });
  const saved = useCount(18250, booted, { delay: 900 });
  const state = booted ? 'show' : 'hidden';

  return (
    <div className="ss-screen">
      <motion.div className="ss-screen-top" variants={beat} custom={0} initial="hidden" animate={state}>
        <span className="ss-dots"><i /><i /><i /></span>
        <span className="ss-screen-search"><i className="bi bi-search" />Search workspace</span>
        <i className="bi bi-bell" />
        <span className="ss-avatar">SS</span>
      </motion.div>

      <div className="ss-screen-body">
        <div className="ss-screen-rail">
          <motion.b variants={beat} custom={.05} initial="hidden" animate={state}><i className="bi bi-layers-fill" /></motion.b>
          {nav.map(([icon, label], i) => (
            <motion.span key={label} className={i === 0 ? 'active' : ''} variants={beat} custom={.12 + i * .05} initial="hidden" animate={state}>
              <i className={`bi ${icon}`} />{label}
            </motion.span>
          ))}
        </div>

        <div className="ss-screen-canvas">
          <motion.div className="ss-screen-head" variants={beat} custom={.24} initial="hidden" animate={state}>
            <div><small>Good morning, Utsav</small><strong>Business overview</strong></div>
            <span className="ss-chip">Today <i className="bi bi-chevron-down" /></span>
          </motion.div>

          <div className="ss-kpis">
            <motion.div className="ss-kpi ss-kpi-health" variants={beat} custom={.32} initial="hidden" animate={state}>
              <small>Business health</small>
              <b>{Math.round(health)}</b>
              <em><i className="bi bi-arrow-up-short" />Excellent</em>
              <span className="ss-kpi-meter"><motion.i initial={{ scaleX: 0 }} animate={booted ? { scaleX: .92 } : { scaleX: 0 }} transition={{ duration: 1.2, delay: .34, ease: [.16, 1, .3, 1] }} /></span>
            </motion.div>
            <motion.div className="ss-kpi" variants={beat} custom={.4} initial="hidden" animate={state}>
              <small>Revenue this week</small>
              <b>&#8377;{revenue.toFixed(1)}k</b>
              <em className="ok"><i className="bi bi-arrow-up-short" />+14.2%</em>
            </motion.div>
            <motion.div className="ss-kpi" variants={beat} custom={.48} initial="hidden" animate={state}>
              <small>Projected savings</small>
              <b>&#8377;{Math.round(saved).toLocaleString('en-IN')}</b>
              <em className="ok"><i className="bi bi-shield-check" />Protected</em>
            </motion.div>
          </div>

          <motion.div className="ss-chart" variants={beat} custom={.56} initial="hidden" animate={state}>
            <div className="ss-chart-head"><small>Demand forecast</small><span className="ss-legend"><i />Actual<i className="gold" />Predicted</span></div>
            <div className="ss-chart-body">
              <div className="ss-bars">
                {bars.map((h, i) => <motion.i key={i} style={{ height: `${h}%` }} className={i > 4 ? 'gold' : ''} initial={{ scaleY: 0 }} animate={booted ? { scaleY: 1 } : { scaleY: 0 }} transition={{ duration: .6, delay: .62 + i * .06, ease: [.16, 1, .3, 1] }} />)}
              </div>
              <svg className="ss-line" viewBox="0 0 220 60" preserveAspectRatio="none" aria-hidden="true">
                <motion.path d="M2 46 L38 38 L74 41 L110 24 L146 30 L182 12 L216 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={booted ? { pathLength: 1 } : { pathLength: 0 }} transition={{ duration: 1.4, delay: .7, ease: [.16, 1, .3, 1] }} />
              </svg>
            </div>
          </motion.div>

          <div className="ss-screen-lower">
            <motion.div className="ss-alerts" variants={beat} custom={.78} initial="hidden" animate={state}>
              <small>Notifications</small>
              {alerts.map(([icon, label, value, tone], i) => (
                <motion.span key={label} className={`ss-alert ${tone}`} initial={{ opacity: 0, x: -8 }} animate={booted ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }} transition={{ duration: .45, delay: .84 + i * .1 }}>
                  <i className={`bi ${icon}`} />{label}<b>{value}</b>
                </motion.span>
              ))}
            </motion.div>
            <motion.div className="ss-rec" variants={beat} custom={1.02} initial="hidden" animate={state}>
              <span className="ss-rec-icon"><i className="bi bi-stars" /></span>
              <div>
                <small>AI recommendation</small>
                <strong>Reorder 24 units of Amul Butter 500g</strong>
                <p>Demand rising 18% and cover drops below 5 days.</p>
              </div>
              <span className="ss-rec-conf">98%<em>confidence</em></span>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
