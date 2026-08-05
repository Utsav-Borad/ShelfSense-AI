import { motion } from 'framer-motion';
import { SORTS, STATUS_META } from './data';

const EASE = [.16, 1, .3, 1];

// Category and status filters are chips rather than dropdowns: on a page about
// spotting outliers, the options should be visible at a glance.
export default function ProductToolbar({
  categories = [],
  query, onQuery, category, onCategory, status, onStatus,
  sort, onSort, view, onView, total, shown, onReset, filtered,
}) {
  return (
    <div className="pi-toolbar">
      <div className="pi-toolbar-row">
        <div className="pi-search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search product, brand or category"
            aria-label="Search products"
          />
          {query && (
            <button type="button" onClick={() => onQuery('')} aria-label="Clear search">
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          )}
        </div>

        <label className="pi-sort">
          <span className="visually-hidden">Sort products by</span>
          <select value={sort} onChange={(event) => onSort(event.target.value)}>
            {SORTS.map((option) => <option key={option.value} value={option.value}>Sort: {option.label}</option>)}
          </select>
          <i className="bi bi-chevron-down" aria-hidden="true" />
        </label>

        <div className="pi-view" role="group" aria-label="View mode">
          {[['grid', 'bi-grid-3x3-gap-fill', 'Grid'], ['table', 'bi-list-ul', 'Table']].map(([value, icon, label]) => (
            <button
              key={value}
              type="button"
              className={view === value ? 'is-active' : ''}
              onClick={() => onView(value)}
              aria-pressed={view === value}
              title={`${label} view`}
            >
              {view === value && <motion.span className="pi-view-pill" layoutId="pi-view-pill" transition={{ duration: .32, ease: EASE }} />}
              <i className={`bi ${icon}`} aria-hidden="true" />
              <span className="visually-hidden">{label} view</span>
            </button>
          ))}
        </div>
      </div>

      <div className="pi-chip-rows">
        <div className="pi-chips" role="group" aria-label="Filter by category">
          <button type="button" className={category === 'all' ? 'is-active' : ''} onClick={() => onCategory('all')} aria-pressed={category === 'all'}>
            All categories
          </button>
          {categories.map((value) => (
            <button key={value} type="button" className={category === value ? 'is-active' : ''} onClick={() => onCategory(value)} aria-pressed={category === value}>
              {value}
            </button>
          ))}
        </div>

        <div className="pi-chips is-status" role="group" aria-label="Filter by status">
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
      </div>

      <div className="pi-toolbar-foot">
        <span>{shown} of {total} products</span>
        {filtered && (
          <button type="button" className="pi-reset" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
