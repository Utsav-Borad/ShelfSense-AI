import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { COLUMNS } from './data';

const EASE = [.16, 1, .3, 1];

// Search collapses to an icon until it is needed, then expands. The filter and
// column controls sit beside it.
export default function InventoryToolbar({
  query, onQuery, filtersOpen, onToggleFilters, activeFilterCount,
  visibleColumns, onToggleColumn, total, shown,
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const expanded = searchOpen || query.length > 0;

  return (
    <div className="inv-toolbar">
      <div className="inv-toolbar-left">
        <h2>Inventory</h2>
        <span className="inv-result-count">{shown} of {total} products</span>
      </div>

      <div className="inv-toolbar-right">
        <motion.div
          className={`inv-search${expanded ? ' is-open' : ''}`}
          initial={false}
          animate={{ width: expanded ? 258 : 42 }}
          transition={{ duration: .38, ease: EASE }}
        >
          <button type="button" className="inv-search-icon" onClick={() => setSearchOpen(true)} aria-label="Search inventory" aria-expanded={expanded}>
            <i className="bi bi-search" aria-hidden="true" />
          </button>
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => { if (!query) setSearchOpen(false); }}
            placeholder="Search name, brand or barcode"
            aria-label="Search inventory"
            tabIndex={expanded ? 0 : -1}
          />
          {query && (
            <button type="button" className="inv-search-clear" onClick={() => onQuery('')} aria-label="Clear search">
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          )}
        </motion.div>

        <button type="button" className={`inv-tool-btn${filtersOpen ? ' is-active' : ''}`} onClick={onToggleFilters} aria-expanded={filtersOpen}>
          <i className="bi bi-sliders" aria-hidden="true" />Filters
          {activeFilterCount > 0 && <span className="inv-tool-count">{activeFilterCount}</span>}
        </button>

        <div className="inv-columns-wrap">
          <button type="button" className={`inv-tool-btn${columnsOpen ? ' is-active' : ''}`} onClick={() => setColumnsOpen(!columnsOpen)} aria-expanded={columnsOpen}>
            <i className="bi bi-layout-three-columns" aria-hidden="true" />Columns
          </button>
          <AnimatePresence>
            {columnsOpen && (
              <motion.div
                className="inv-columns-menu"
                initial={{ opacity: 0, y: -8, scale: .97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: .97 }}
                transition={{ duration: .24, ease: EASE }}
              >
                <p>Visible columns</p>
                {COLUMNS.map((column) => (
                  <label key={column.id} className={column.always ? 'is-locked' : ''}>
                    <input
                      type="checkbox"
                      checked={column.always || visibleColumns.includes(column.id)}
                      disabled={column.always}
                      onChange={() => onToggleColumn(column.id)}
                    />
                    <span>{column.label}</span>
                    {column.always && <i className="bi bi-lock" aria-hidden="true" />}
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
