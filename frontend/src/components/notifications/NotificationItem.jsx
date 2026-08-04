import { motion } from 'framer-motion';
import { PRIORITY_META, TYPE_META } from './data';

const EASE = [.16, 1, .3, 1];

export default function NotificationItem({
  notification, index, revealed, isHighlighted, isSelected,
  onOpen, onToggleRead, onArchive, onSelect,
}) {
  const type = TYPE_META[notification.type];
  const priority = PRIORITY_META[notification.priority];

  return (
    <motion.li
      id={`note-${notification.id}`}
      className={`nt-item tone-${type.tone}${notification.read ? ' is-read' : ''}${isHighlighted ? ' is-highlighted' : ''}${isSelected ? ' is-selected' : ''}`}
      initial={{ opacity: 0, y: 14 }}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: .45, delay: revealed ? Math.min(index, 10) * .05 : 0, ease: EASE }}
      layout
    >
      <label className="nt-select">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(notification.id)}
          aria-label={`Select ${notification.title}`}
        />
      </label>

      <span className={`nt-item-icon tone-${type.tone}`}>
        <i className={`bi ${type.icon}`} aria-hidden="true" />
        {!notification.read && <span className="nt-unread-dot" aria-label="Unread" />}
      </span>

      <div className="nt-item-body">
        <div className="nt-item-top">
          {/* Pulses once as it arrives, then stays still. */}
          <motion.span
            className={`nt-priority tone-${priority.tone}`}
            initial={{ scale: .92 }}
            animate={revealed ? { scale: [0.92, 1.08, 1] } : { scale: .92 }}
            transition={{ duration: .7, delay: .15 + Math.min(index, 10) * .05, ease: EASE }}
          >
            {priority.label}
          </motion.span>
          <span className="nt-type">{type.label}</span>
          <time>{notification.time}</time>
        </div>

        <button type="button" className="nt-item-title" onClick={() => onOpen(notification)}>
          {notification.title}
        </button>
        <p>{notification.detail}</p>

        <div className="nt-item-foot">
          <span className="nt-meta"><i className="bi bi-dot" aria-hidden="true" />{notification.meta}</span>
          <span className="nt-action-hint">{notification.action}</span>
        </div>
      </div>

      <div className="nt-item-actions">
        <button
          type="button"
          onClick={() => onToggleRead(notification.id)}
          title={notification.read ? 'Mark as unread' : 'Mark as read'}
          aria-label={notification.read ? `Mark ${notification.title} as unread` : `Mark ${notification.title} as read`}
        >
          <i className={`bi bi-${notification.read ? 'envelope' : 'envelope-open'}`} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onArchive(notification.id)}
          title={notification.archived ? 'Restore' : 'Archive'}
          aria-label={notification.archived ? `Restore ${notification.title}` : `Archive ${notification.title}`}
        >
          <i className={`bi bi-${notification.archived ? 'arrow-counterclockwise' : 'archive'}`} aria-hidden="true" />
        </button>
      </div>
    </motion.li>
  );
}
