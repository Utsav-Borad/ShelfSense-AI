import { motion } from 'framer-motion';
import { Sparkline } from '../charts';
import useCountUp from '../../hooks/useCountUp';
import { KPIS } from './data';

const EASE = [.16, 1, .3, 1];

function KpiCard({ kpi, index }) {
  const value = useCountUp(kpi.value, { duration: 1500, delay: 380 + index * 90 });
  // A rising "low stock" count is bad news, so some cards read their delta the
  // other way round.
  const good = kpi.invertDelta ? kpi.delta < 0 : kpi.delta > 0;

  return (
    <motion.article
      className={`dash-card dash-kpi tone-${kpi.tone}`}
      initial={{ opacity: 0, y: 24, scale: .97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: .7, delay: .34 + index * .07, ease: EASE }}
      whileHover={{ y: -5, transition: { duration: .28, ease: 'easeOut' } }}
    >
      <span className="dash-sweep" aria-hidden="true" />
      <header>
        <span className="dash-kpi-icon"><i className={`bi ${kpi.icon}`} aria-hidden="true" /></span>
        <span className={`dash-delta is-${good ? 'good' : 'bad'}`}>
          <i className={`bi bi-arrow-${kpi.delta > 0 ? 'up' : 'down'}-short`} aria-hidden="true" />
          {Math.abs(kpi.delta)}%
        </span>
      </header>
      <p className="dash-kpi-label">{kpi.label}</p>
      <strong className="dash-kpi-value">
        {kpi.prefix}{Math.round(value).toLocaleString('en-IN')}
      </strong>
      <small className="dash-kpi-note">{kpi.note}</small>
      <Sparkline values={kpi.spark} tone={kpi.tone} delay={.5 + index * .07} />
    </motion.article>
  );
}

export default function KpiGrid() {
  return (
    <section className="dash-kpi-grid" aria-label="Key figures">
      {KPIS.map((kpi, index) => <KpiCard key={kpi.id} kpi={kpi} index={index} />)}
    </section>
  );
}
