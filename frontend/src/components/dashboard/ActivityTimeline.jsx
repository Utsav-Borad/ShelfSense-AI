import { motion } from 'framer-motion';
import EmptyState from '../ui/EmptyState';

const EASE = [.16, 1, .3, 1];

// Builds top to bottom: the rail draws down while each entry lands under it.
//
// This shows live alerts from the notification engine rather than an activity
// log — the backend keeps no audit trail of past events, so "what happened"
// cannot be answered, but "what needs attention" can.
export default function ActivityTimeline({ events = [] }) {

  return (
    <motion.section
      className="dash-card dash-panel dash-activity"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .7, delay: .16, ease: EASE }}
    >
      <span className="dash-sweep" aria-hidden="true" />
      <header className="dash-panel-head">
        <div>
          <p className="dash-eyebrow">Alerts</p>
          <h3>What needs attention</h3>
        </div>
      </header>

      {events.length === 0 ? (
        <EmptyState icon="bi-check2-circle" title="Nothing needs attention" description="Every product is within its stock and expiry limits." />
      ) : (
        <ol className="dash-timeline">
          <motion.span
            className="dash-timeline-rail"
            aria-hidden="true"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: .3, ease: EASE }}
          />
          {events.map((event, index) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .5, delay: .38 + index * .11, ease: EASE }}
            >
              <span className={`dash-timeline-dot tone-${event.tone}`}>
                <i className={`bi ${event.icon}`} aria-hidden="true" />
              </span>
              <div className="dash-timeline-body">
                <strong>{event.title}</strong>
                <small>{event.detail}</small>
              </div>
              <span className="dash-timeline-tag">{event.time}</span>
            </motion.li>
          ))}
        </ol>
      )}
    </motion.section>
  );
}
