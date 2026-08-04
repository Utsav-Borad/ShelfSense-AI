import { RevealCard, SectionHead } from './Reveal';

// The four working parts of the platform, drawn from the eight documented modules.
const pillars = [
  ['bi-cloud-arrow-up', 'CSV Synchronization', 'Your POS already exports it. We take it from there.', ['Sales, inventory and purchase reports', 'Column, type and duplicate validation', 'All-or-nothing sync inside one transaction', 'Row-level error reporting']],
  ['bi-pie-chart', 'Analytics Engine', 'Ten business metrics, recomputed after every sync.', ['Stock, value, revenue and profit', 'Fast, slow and dead movement', 'Near-expiry exposure', 'Supplier statistics and monthly trends']],
  ['bi-cpu', 'AI Decision Engine', 'Six models that answer the question a report cannot.', ['Demand forecasting', 'Dead stock and loss prediction', 'Discount and reorder recommendations', 'A confidence score on every output']],
  ['bi-envelope-paper', 'Reports & Notifications', 'The decision reaches you, not the other way round.', ['Daily, weekly and monthly reports', 'CSV and PDF export', 'Email delivery for what needs attention', 'A full notification history']],
];

export default function Pillars() {
  return (
    <section className="ss-section ss-pillars" id="platform">
      <SectionHead
        eyebrow="One system, four working parts"
        title={<>Everything between your CSV<br />and your next <em>decision</em>.</>}
      />
      <div className="ss-pillar-grid">
        {pillars.map(([icon, title, lead, points], i) => (
          <RevealCard className="ss-pillar" key={title} delay={(i % 2) * .12}>
            <span className="ss-pillar-icon"><i className={`bi ${icon}`} /></span>
            <h3>{title}</h3>
            <p>{lead}</p>
            <ul>{points.map((p) => <li key={p}><i className="bi bi-check2" />{p}</li>)}</ul>
          </RevealCard>
        ))}
      </div>
    </section>
  );
}
