import Reveal, { RevealCard, SectionHead } from './Reveal';

// The project's own boundary statement: it starts after billing.
const rows = [
  ['Records what you have in stock', 'Predicts what you will need next week'],
  ['Prints the bill', 'Reads the bill after it is printed'],
  ['Tracks batches and expiry dates', 'Flags the batch that will expire before it sells'],
  ['Shows last month’s revenue', 'Shows the margin you are about to lose'],
  ['Waits for you to ask a question', 'Tells you which question matters today'],
  ['Answers "what happened?"', 'Answers "what should happen next?"'],
];

export default function Positioning() {
  return (
    <section className="ss-section ss-positioning" id="positioning">
      <SectionHead
        align="center"
        eyebrow="Where ShelfSense sits"
        title={<>It is not inventory software.<br /><em>It is the layer above it.</em></>}
        lead="ShelfSense is not a POS, not a billing system, and not an ERP. It works alongside the software you already run — the project starts after billing."
      />
      <div className="ss-compare">
        <RevealCard className="ss-compare-col">
          <header><span className="ss-compare-tag">Your existing software</span><h3>Tells you what happened</h3></header>
          {rows.map(([a]) => <p key={a}><i className="bi bi-dash-lg" />{a}</p>)}
        </RevealCard>
        <RevealCard className="ss-compare-col is-primary" delay={.14}>
          <header><span className="ss-compare-tag">ShelfSense AI</span><h3>Tells you what to do next</h3></header>
          {rows.map(([, b]) => <p key={b}><i className="bi bi-check-lg" />{b}</p>)}
        </RevealCard>
      </div>
      <Reveal className="ss-positioning-note" delay={.16}>
        <i className="bi bi-info-circle" />
        <span>ShelfSense never places an order, never applies a discount, and never edits your inventory. Every output is advice. The owner decides.</span>
      </Reveal>
    </section>
  );
}
