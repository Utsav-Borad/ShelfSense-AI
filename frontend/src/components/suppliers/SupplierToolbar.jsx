import { motion } from 'framer-motion';
import { SORTS, STATUS_META } from './data';

const EASE = [.16, 1, .3, 1];

export default function SupplierToolbar({
  query, onQuery, status, onStatus,
  sort, onSort, view, onView, total, shown, filtered, onReset,
}) {
  return (
    <div className="sp-toolbar">
      <div className="sp-toolbar-row">
        <div className="sp-search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search supplier, code or category"
            aria-label="Search suppliers"
          />
          {query && (
            <button type="button" onClick={() => onQuery('')} aria-label="Clear search">
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          )}
        </div>

        <label className="sp-select">
          <span className="visually-hidden">Sort suppliers by</span>
          <select value={sort} onChange={(event) => onSort(event.target.value)}>
            {SORTS.map((option) => <option key={option.value} value={option.value}>Sort: {option.label}</option>)}
          </select>
          <i className="bi bi-chevron-down" aria-hidden="true" />
        </label>

        <div className="sp-view" role="group" aria-label="View mode">
          {[['grid', 'bi-grid-3x3-gap-fill', 'Grid'], ['table', 'bi-list-ul', 'Table']].map(([value, icon, label]) => (
            <button
              key={value}
              type="button"
              className={view === value ? 'is-active' : ''}
              onClick={() => onView(value)}
              aria-pressed={view === value}
              title={`${label} view`}
            >
              {view === value && <motion.span className="sp-view-pill" layoutId="sp-view-pill" transition={{ duration: .32, ease: EASE }} />}
              <i className={`bi ${icon}`} aria-hidden="true" />
              <span className="visually-hidden">{label} view</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sp-advanced">
        

        

        
      </div>

      <div className="sp-chips" role="group" aria-label="Filter by status">
        {Object.entries(STATUS_META).map(([value, meta]) => (
          <button
            key={value}
            type="button"
            className={`tone-${meta.tone}${status === value ? ' is-active' : ''}`}
            onClick={() => onStatus(status === value ? 'all' : value)}
            aria-pressed={status === value}
          >
            <i className={`bi ${meta.icon}`} aria-hidden="true" />{meta.label}
          </button>
        ))}
      </div>

      <div className="sp-toolbar-foot">
        <span>{shown} of {total} suppliers</span>
        {filtered && (
          <button type="button" className="sp-reset" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
