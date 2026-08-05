import { motion } from 'framer-motion';
import { BarChart, DonutChart, LineChart } from '../charts';

const EASE = [.16, 1, .3, 1];

function ChartCard({ title, caption, meta, children, delay, wide }) {
  return (
    <motion.article
      className={`dash-card dash-chart${wide ? ' is-wide' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .7, delay, ease: EASE }}
      whileHover={{ y: -4, transition: { duration: .28, ease: 'easeOut' } }}
    >
      <span className="dash-sweep" aria-hidden="true" />
      <header className="dash-panel-head">
        <div>
          <p className="dash-eyebrow">{caption}</p>
          <h3>{title}</h3>
        </div>
        {meta && <span className="dash-chip">{meta}</span>}
      </header>
      {children}
    </motion.article>
  );
}

// The "value on the shelf over time" area chart has been removed: it needs a
// history of past stock positions, and the database only ever holds the current
// one. Nothing here is invented — each chart is a real series from the API.
export default function ChartsSection({ salesTrend, revenueBars, demandSplit }) {
  const leader = demandSplit[0];

  return (
    <section className="dash-charts" aria-label="Analytics">
      <ChartCard caption="Sales" title="Units sold per day" meta="last 7 days" delay={.1} wide>
        <LineChart id="sales" values={salesTrend.values} labels={salesTrend.labels} tone="gold" />
      </ChartCard>

      <ChartCard caption="Revenue" title="Revenue by day" meta="₹ thousands" delay={.16}>
        <BarChart values={revenueBars.values} labels={revenueBars.labels} />
      </ChartCard>

      <ChartCard caption="Demand" title="Share by product" meta="top movers" delay={.22}>
        <div className="dash-donut-row">
          <DonutChart
            segments={demandSplit}
            centerValue={leader ? `${leader.value}%` : '—'}
            centerLabel={leader ? `${leader.label} leads` : 'No sales yet'}
          />
          <ul className="dash-legend">
            {demandSplit.map((segment) => (
              <li key={segment.label}>
                <i className={`tone-${segment.tone}`} aria-hidden="true" />
                {segment.label}<b>{segment.value}%</b>
              </li>
            ))}
          </ul>
        </div>
      </ChartCard>
    </section>
  );
}
