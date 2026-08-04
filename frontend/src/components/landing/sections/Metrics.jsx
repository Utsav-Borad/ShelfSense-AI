import { RevealCard, SectionHead } from './Reveal';

// The ten analytics outputs the engine produces after every synchronization.
const metrics = [
  ['bi-boxes', 'Current stock', 'Live position across every product'],
  ['bi-cash-stack', 'Inventory value', 'Capital currently sitting on the shelf'],
  ['bi-graph-up', 'Revenue', 'Movement across day, week and month'],
  ['bi-percent', 'Profit estimate', 'Margin after purchase price and discount'],
  ['bi-lightning-charge', 'Fast moving', 'What is funding the business right now'],
  ['bi-hourglass-split', 'Slow moving', 'What is quietly slowing down'],
  ['bi-box2-heart', 'Dead stock', 'Capital that has stopped working'],
  ['bi-clock-history', 'Near expiry', 'Exposure with time still left to act'],
  ['bi-truck', 'Supplier statistics', 'Who delivers on time, in full, at price'],
  ['bi-calendar3', 'Monthly trends', 'The shape of the business over time'],
];

export default function Metrics() {
  return (
    <section className="ss-section ss-metrics" id="analytics">
      <SectionHead
        align="center"
        eyebrow="The analytics engine"
        title={<>Ten answers, computed for you<br />every time you <em>sync</em>.</>}
        lead="No dashboards to configure and no formulas to write. The engine derives all of it from the three reports your POS already produces."
      />
      <div className="ss-metric-grid">
        {metrics.map(([icon, title, text], i) => (
          <RevealCard className="ss-metric" key={title} delay={(i % 5) * .07}>
            <i className={`bi ${icon}`} />
            <strong>{title}</strong>
            <small>{text}</small>
          </RevealCard>
        ))}
      </div>
    </section>
  );
}
