import { AnimatePresence, motion } from 'framer-motion';
import { DATE_FILTERS, TABS, TYPE_META } from './data';

const EASE = [.16, 1, .3, 1];

export default function NotificationToolbar({
  tab, onTab, counts, query, onQuery, category, onCategory, date, onDate,
  selected, onBulkRead, onBulkArchive, onClearSelection, onMarkAllRead, unreadCount,
}) {
  return (
    <div className="nt-toolbar">
      <div className="nt-tabs" role="tablist" aria-label="Notification priority">
        {TABS.map((option) => (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={tab === option.id}
            className={tab === option.id ? 'is-active' : ''}
            onClick={() => onTab(option.id)}
          >
            {tab === option.id && <motion.span className="nt-tab-pill" layoutId="nt-tab-pill" transition={{ duration: .32, ease: EASE }} />}
            <span>{option.label}</span>
            {counts[option.id] > 0 && <em>{counts[option.id]}</em>}
          </button>
        ))}
      </div>

      <div className="nt-filters">
        <div className="nt-search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search notifications"
            aria-label="Search notifications"
          />
          {query && (
            <button type="button" onClick={() => onQuery('')} aria-label="Clear search">
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          )}
        </div>

        <label className="nt-select-field">
          <span className="visually-hidden">Filter by category</span>
          <select value={category} onChange={(event) => onCategory(event.target.value)}>
            <option value="all">All categories</option>
            {Object.entries(TYPE_META).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}
          </select>
          <i className="bi bi-chevron-down" aria-hidden="true" />
        </label>

        <label className="nt-select-field">
          <span className="visually-hidden">Filter by date</span>
          <select value={date} onChange={(event) => onDate(event.target.value)}>
            {DATE_FILTERS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
          <i className="bi bi-chevron-down" aria-hidden="true" />
        </label>

        <button type="button" className="nt-btn nt-btn-ghost" onClick={onMarkAllRead} disabled={unreadCount === 0}>
          <i className="bi bi-check2-all" aria-hidden="true" />Mark all read
        </button>
      </div>

      {/* The bulk bar takes over the toolbar when a selection exists. */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            className="nt-bulk"
            role="status"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: .28, ease: EASE }}
          >
            <div className="nt-bulk-inner">
              <strong>{selected.length} selected</strong>
              <button type="button" onClick={onBulkRead}><i className="bi bi-envelope-open" aria-hidden="true" />Mark read</button>
              <button type="button" onClick={onBulkArchive}><i className="bi bi-archive" aria-hidden="true" />Archive</button>
              <button type="button" className="is-quiet" onClick={onClearSelection}>Clear</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
