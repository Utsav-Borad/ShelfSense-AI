import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal, { EASE, SectionHead } from './Reveal';

// The six documented prediction modules. Selecting one shows the shape every
// recommendation carries: prediction, confidence, reason, business impact.
const modules = [
  {
    id: 'demand', icon: 'bi-graph-up-arrow', name: 'Demand Forecast', model: 'Random Forest Regressor',
    blurb: 'How much of this product will move over the coming period.',
    prediction: 'Amul Butter 500g — 41 units expected over the next 7 days',
    confidence: 94, tone: 'gold',
    reason: 'Sales velocity rose 18% across the last three weeks and the same period last month showed a comparable lift.',
    impact: 'Current cover lasts 4.6 days. Ordering now avoids a stockout on a top-ten revenue product.',
  },
  {
    id: 'dead', icon: 'bi-box2-heart', name: 'Dead Stock Detection', model: 'Random Forest Classifier',
    blurb: 'Which products have stopped working as capital.',
    prediction: '7 products classified as dead stock — ₹42,800 held',
    confidence: 89, tone: 'danger',
    reason: 'No recorded sale in 63 days while comparable products in the same category continued to move.',
    impact: '₹42,800 of working capital is recoverable through clearance or return-to-supplier.',
  },
  {
    id: 'loss', icon: 'bi-exclamation-triangle', name: 'Inventory Loss Prediction', model: 'Regression',
    blurb: 'What you are on course to write off, and when.',
    prediction: '₹6,150 projected loss in the next 30 days',
    confidence: 86, tone: 'warn',
    reason: '12 batches reach expiry inside 30 days at a sell-through rate below what is needed to clear them.',
    impact: 'Acting in the next 9 days recovers an estimated 68% of the exposed value.',
  },
  {
    id: 'discount', icon: 'bi-tag', name: 'Discount Recommendation', model: 'Rule-guided model output',
    blurb: 'The smallest discount that still clears the stock in time.',
    prediction: 'Apply 12% on Fresh Cream 250ml for 6 days',
    confidence: 91, tone: 'gold',
    reason: 'Sell-through needs to rise 2.1x to clear before expiry. Historical elasticity clears it at 12%.',
    impact: 'Protects ₹3,400 of margin against a full write-off of ₹5,900.',
  },
  {
    id: 'reorder', icon: 'bi-arrow-repeat', name: 'Reorder Recommendation', model: 'Forecast-driven quantity',
    blurb: 'What to buy, how much, and by when.',
    prediction: 'Reorder 24 units before Thursday',
    confidence: 98, tone: 'sage',
    reason: 'Forecast demand of 41 units against 18 on hand, with a 3-day supplier lead time.',
    impact: 'Maintains continuous availability without adding to slow-moving stock.',
  },
  {
    id: 'supplier', icon: 'bi-truck', name: 'Supplier Performance', model: 'Weighted scoring',
    blurb: 'Who to trust with the order you are about to place.',
    prediction: 'Sharma Distributors — score A+ (92 / 100)',
    confidence: 95, tone: 'sage',
    reason: 'On-time delivery 96%, fill rate 98%, price variance under 2% across 41 purchase records.',
    impact: 'Shifting the two weakest lines to this supplier reduces expected delay by 2.4 days.',
  },
];

export default function AiEngine() {
  const [active, setActive] = useState(modules[0].id);
  const current = modules.find((m) => m.id === active);

  return (
    <section className="ss-section ss-ai" id="intelligence">
      <SectionHead
        eyebrow="The decision engine"
        title={<>Six models. And a reason<br />behind <em>every single one</em>.</>}
        lead="A prediction you cannot interrogate is not much better than a guess. Every ShelfSense output arrives with its confidence, its reasoning, and the money attached to it."
      />

      <div className="ss-ai-body">
        <Reveal className="ss-ai-list">
          {modules.map((m, i) => (
            <button key={m.id} className={`ss-ai-tab${m.id === active ? ' is-active' : ''}`} onClick={() => setActive(m.id)} aria-pressed={m.id === active}>
              <span className="ss-ai-tab-icon"><i className={`bi ${m.icon}`} /></span>
              <span className="ss-ai-tab-text"><strong>{m.name}</strong><small>{m.blurb}</small></span>
              <em>{String(i + 1).padStart(2, '0')}</em>
              {m.id === active && <motion.span className="ss-ai-tab-glow" layoutId="ss-ai-glow" transition={{ duration: .45, ease: EASE }} />}
            </button>
          ))}
        </Reveal>

        <Reveal className="ss-ai-panel" delay={.1}>
          <AnimatePresence mode="wait">
            <motion.article
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: .4, ease: EASE }}
              className={`ss-ai-card tone-${current.tone}`}
            >
              <header>
                <span className="ss-ai-card-icon"><i className={`bi ${current.icon}`} /></span>
                <div><small>{current.name}</small><span className="ss-ai-model">{current.model}</span></div>
                <div className="ss-ai-conf">
                  <svg viewBox="0 0 44 44" aria-hidden="true">
                    <circle cx="22" cy="22" r="19" />
                    <motion.circle cx="22" cy="22" r="19" className="ss-ai-conf-arc" initial={{ pathLength: 0 }} animate={{ pathLength: current.confidence / 100 }} transition={{ duration: 1, ease: EASE }} />
                  </svg>
                  <b>{current.confidence}%</b>
                  <em>confidence</em>
                </div>
              </header>

              <h3>{current.prediction}</h3>

              <div className="ss-ai-rows">
                <div><span>Reason</span><p>{current.reason}</p></div>
                <div><span>Business impact</span><p>{current.impact}</p></div>
              </div>

              <footer>
                <span className="ss-ai-advisory"><i className="bi bi-hand-index-thumb" />Advisory only — no order is placed and no stock is changed</span>
              </footer>
            </motion.article>
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
