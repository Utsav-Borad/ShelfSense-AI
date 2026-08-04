import { motion } from 'framer-motion';
import { RECOMMENDATIONS } from './data';

const EASE = [.16, 1, .3, 1];

// The scroll target for "Review recommendations" in the hero.
export default function InventoryRecommendations() {
  return (
    <section className="inv-recs" id="inventory-recommendations" aria-label="Inventory recommendations">
      <header className="inv-section-head">
        <div>
          <p className="inv-eyebrow">AI recommendations</p>
          <h2>What to do about this inventory</h2>
        </div>
      </header>

      <div className="inv-rec-grid">
        {RECOMMENDATIONS.map((rec, index) => (
          <motion.article
            key={rec.id}
            className={`inv-rec tone-${rec.tone}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .3 }}
            transition={{ duration: .7, delay: index * .1, ease: EASE }}
            whileHover={{ y: -5, transition: { duration: .28, ease: 'easeOut' } }}
          >
            <span className="inv-sweep" aria-hidden="true" />
            <header>
              <span className="inv-rec-icon"><i className={`bi ${rec.icon}`} aria-hidden="true" /></span>
              <span className={`inv-priority is-${rec.priority.toLowerCase()}`}>{rec.priority}</span>
              <span className="inv-rec-conf">{rec.confidence}%<em>confidence</em></span>
            </header>
            <h3>{rec.title}</h3>
            <p className="inv-rec-reason">{rec.reason}</p>
            <p className="inv-rec-impact"><i className="bi bi-graph-up-arrow" aria-hidden="true" />{rec.impact}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
