import { motion } from 'framer-motion';
import { AreaChart, BarChart, DonutChart, LineChart } from '../charts';
import { DEMAND_SPLIT, INVENTORY_AREA, REVENUE_BARS, SALES_TREND } from './data';

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

export default function ChartsSection() {
  return (
    <section className="dash-charts" aria-label="Analytics">
      <ChartCard caption="Sales" title="Units sold this week" meta="+18% vs last" delay={.1} wide>
        <LineChart id="sales" values={SALES_TREND.values} labels={SALES_TREND.labels} tone="gold" />
      </ChartCard>

      <ChartCard caption="Revenue" title="Revenue by day" meta="₹ thousands" delay={.16}>
        <BarChart values={REVENUE_BARS.values} labels={REVENUE_BARS.labels} />
      </ChartCard>

      <ChartCard caption="Inventory" title="Value on the shelf" meta="8 weeks" delay={.22}>
        <AreaChart id="inv" values={INVENTORY_AREA.values} compare={INVENTORY_AREA.compare} labels={INVENTORY_AREA.labels} />
      </ChartCard>

      <ChartCard caption="Demand" title="Share by category" delay={.28}>
        <div className="dash-donut-row">
          <DonutChart segments={DEMAND_SPLIT} centerValue="34%" centerLabel="Dairy leads" />
          <ul className="dash-legend">
            {DEMAND_SPLIT.map((segment) => (
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
