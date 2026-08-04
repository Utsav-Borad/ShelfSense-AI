import { RevealCard, SectionHead } from './Reveal';

const pains = [
  ['bi-box2-heart', 'Dead stock found too late', 'Capital sits on the shelf for months before anyone notices it stopped moving.'],
  ['bi-hourglass-bottom', 'Expiry write-offs that were predictable', 'Stock reaches its date while the signal was visible weeks earlier.'],
  ['bi-graph-down-arrow', 'Stockouts on your fastest movers', 'The products that fund the business are the ones you run out of.'],
  ['bi-dice-3', 'Reordering by instinct', 'Quantities chosen from memory and habit rather than evidence.'],
  ['bi-truck', 'Suppliers you cannot compare', 'No objective view of who delivers late, short, or expensive.'],
  ['bi-file-earmark-bar-graph', 'Reports that only describe the past', 'You learn what happened. You never learn what to do next.'],
];

export default function Problem() {
  return (
    <section className="ss-section ss-problem" id="problem">
      <SectionHead
        eyebrow="The cost of deciding in the dark"
        title={<>Your data already knows.<br /><em>Nobody is reading it.</em></>}
        lead="Every till in the shop produces a record of what sold, what arrived, and what is sitting still. Almost none of it reaches the person making the next purchase decision."
      />
      <div className="ss-problem-grid">
        {pains.map(([icon, title, text], i) => (
          <RevealCard className="ss-problem-card" key={title} delay={(i % 3) * .09}>
            <i className={`bi ${icon}`} />
            <h3>{title}</h3>
            <p>{text}</p>
          </RevealCard>
        ))}
      </div>
    </section>
  );
}
