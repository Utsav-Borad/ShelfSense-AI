import { motion } from 'framer-motion';
import EmptyState from '../ui/EmptyState';
import { HISTORY, OPPORTUNITIES, RISKS, getRecommendation } from './data';

const EASE = [.16, 1, .3, 1];

// The three supporting panels. Kept in one file because they share a shape and
// none of them is large enough to earn its own.

export function Opportunities() {
  return (
    <section className="ai-panel" aria-label="Business opportunities">
      <header className="ai-panel-head">
        <div>
          <p className="ai-eyebrow">Business opportunities</p>
          <h3>Worth considering this week</h3>
        </div>
      </header>
      <ul className="ai-opportunities">
        {OPPORTUNITIES.map((item, index) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .4 }}
            transition={{ duration: .55, delay: index * .08, ease: EASE }}
          >
            <span className="ai-opp-icon"><i className={`bi ${item.icon}`} aria-hidden="true" /></span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </div>
            <span className="ai-opp-value">
              <b>+₹{item.value.toLocaleString('en-IN')}</b>
              <em>{item.confidence}% confidence</em>
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export function RiskAlerts() {
  return (
    <section className="ai-panel" aria-label="Risk alerts">
      <header className="ai-panel-head">
        <div>
          <p className="ai-eyebrow">Risk alerts</p>
          <h3>What could cost you</h3>
        </div>
      </header>
      <ul className="ai-risks">
        {RISKS.map((risk, index) => (
          <motion.li
            key={risk.id}
            className={`tone-${risk.tone}`}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: .4 }}
            transition={{ duration: .5, delay: index * .08, ease: EASE }}
          >
            <span className="ai-risk-icon"><i className={`bi ${risk.icon}`} aria-hidden="true" /></span>
            <div>
              <strong>{risk.title}</strong>
              <small>{risk.detail}</small>
            </div>
            <span className={`ai-severity tone-${risk.tone}`}>{risk.severity}</span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}

export function ActionQueue({ accepted, onOpen }) {
  const items = accepted.map(getRecommendation).filter(Boolean);

  return (
    <section className="ai-panel" aria-label="Action queue">
      <header className="ai-panel-head">
        <div>
          <p className="ai-eyebrow">Action queue</p>
          <h3>{items.length ? `${items.length} accepted, waiting on you` : 'Nothing queued yet'}</h3>
        </div>
      </header>

      {items.length === 0 ? (
        <EmptyState icon="bi-inbox" title="No actions queued" description="Accept a recommendation and it will appear here as a task." />
      ) : (
        <ol className="ai-queue">
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .45, delay: index * .06, ease: EASE }}
            >
              <span className="ai-queue-check"><i className="bi bi-check-lg" aria-hidden="true" /></span>
              <button type="button" onClick={() => onOpen(item)}>
                <strong>{item.title}</strong>
                <small>{item.timeline}</small>
              </button>
              <span className="ai-queue-value">₹{item.impactValue.toLocaleString('en-IN')}</span>
            </motion.li>
          ))}
        </ol>
      )}
    </section>
  );
}

export function DecisionHistory() {
  return (
    <section className="ai-panel" aria-label="Decision history">
      <header className="ai-panel-head">
        <div>
          <p className="ai-eyebrow">Decision history</p>
          <h3>What you decided, and what followed</h3>
        </div>
      </header>
      <ol className="ai-history">
        {HISTORY.map((entry, index) => (
          <motion.li
            key={entry.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .3 }}
            transition={{ duration: .45, delay: index * .06, ease: EASE }}
          >
            <span className={`ai-history-dot is-${entry.outcome}`} aria-hidden="true">
              <i className={`bi bi-${entry.outcome === 'accepted' ? 'check-lg' : 'x-lg'}`} />
            </span>
            <div>
              <strong>{entry.decision}</strong>
              <small>{entry.result}</small>
            </div>
            <time>{entry.when}</time>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
