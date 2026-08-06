import { motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';

const EASE = [.16, 1, .3, 1];

function Kpi({ kpi, index }) {
  const value = useCountUp(kpi.value, { duration: 1400, delay: 220 + index * 90 });
  const shown = `${kpi.prefix || ''}${Math.round(value).toLocaleString('en-IN')}`;

  return (
    <motion.article
      className={`ad-kpi tone-${kpi.tone}`}
      initial={{ opacity: 0, y: 24, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .65, delay: index * .08, ease: EASE }}
      whileHover={{ y: -5, transition: { duration: .26, ease: 'easeOut' } }}
    >
      <span className="ad-sweep" aria-hidden="true" />
      {/* No trend badge: nothing on the server records these totals over time,
          so there is no previous figure to compare today's against. */}
      <header>
        <span className="ad-kpi-icon"><i className={`bi ${kpi.icon}`} aria-hidden="true" /></span>
      </header>
      <strong>{shown}</strong>
      <p>{kpi.label}</p>
      <small>{kpi.note}</small>
    </motion.article>
  );
}

// Service uptime, response times and queue depth are not measured anywhere in
// this project, so the old status strip is gone — these totals are what the
// platform can honestly report about itself.
export default function PlatformHealth({ kpis }) {
  return (
    <section className="ad-section" id="platform-health" aria-label="Platform totals">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">Platform totals</p>
          <h2>What the platform holds</h2>
        </div>
      </header>

      <div className="ad-kpi-grid">
        {kpis.map((kpi, index) => <Kpi key={kpi.id} kpi={kpi} index={index} />)}
      </div>
    </section>
  );
}
