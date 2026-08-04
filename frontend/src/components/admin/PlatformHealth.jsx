import { motion } from 'framer-motion';
import useCountUp from '../../hooks/useCountUp';
import { PLATFORM_KPIS, STATE_META, SYSTEM_STATUS } from './data';

const EASE = [.16, 1, .3, 1];

function Kpi({ kpi, index }) {
  const value = useCountUp(kpi.value, { duration: 1400, delay: 220 + index * 90, decimals: kpi.decimals || 0 });
  const shown = kpi.decimals ? value.toFixed(kpi.decimals) : Math.round(value).toLocaleString('en-IN');

  return (
    <motion.article
      className={`ad-kpi tone-${kpi.tone}`}
      initial={{ opacity: 0, y: 24, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .65, delay: index * .08, ease: EASE }}
      whileHover={{ y: -5, transition: { duration: .26, ease: 'easeOut' } }}
    >
      <span className="ad-sweep" aria-hidden="true" />
      <header>
        <span className="ad-kpi-icon"><i className={`bi ${kpi.icon}`} aria-hidden="true" /></span>
        <span className="ad-delta"><i className="bi bi-arrow-up-short" aria-hidden="true" />{kpi.delta}%</span>
      </header>
      <strong>{shown}{kpi.suffix || ''}</strong>
      <p>{kpi.label}</p>
      <small>{kpi.note}</small>
    </motion.article>
  );
}

export default function PlatformHealth() {
  return (
    <section className="ad-section" id="platform-health" aria-label="Platform health">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">Platform health</p>
          <h2>How the platform is running</h2>
        </div>
      </header>

      <div className="ad-kpi-grid">
        {PLATFORM_KPIS.map((kpi, index) => <Kpi key={kpi.id} kpi={kpi} index={index} />)}
      </div>

      <div className="ad-status-row">
        {SYSTEM_STATUS.map((service, index) => {
          const meta = STATE_META[service.state];
          return (
            <motion.div
              key={service.id}
              className={`ad-status tone-${meta.tone}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .5, delay: .5 + index * .06, ease: EASE }}
            >
              <span className="ad-status-dot" aria-hidden="true" />
              <div>
                <strong>{service.label}</strong>
                <small>{service.detail}</small>
              </div>
              <span className="ad-status-tag"><i className={`bi ${meta.icon}`} aria-hidden="true" />{meta.label}</span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
