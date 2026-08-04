import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { searchDestinations } from './SearchDestinations';

// The topbar search. It navigates the workspace rather than querying data —
// there is no search API yet, and a box that silently does nothing is worse
// than one that does something useful.
//
// Cmd/Ctrl+K focuses it, arrows move, Enter goes, Escape closes.
export default function WorkspaceSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = searchDestinations(query);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.getElementById('workspace-search')?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Keep the highlighted row inside the result list as it shrinks.
  useEffect(() => { setActive(0); }, [query]);

  function go(destination) {
    if (!destination) return;
    navigate(destination.to);
    setQuery('');
    setOpen(false);
    document.getElementById('workspace-search')?.blur();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') { setQuery(''); setOpen(false); event.currentTarget.blur(); return; }
    if (!results.length) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((current) => (current + 1) % results.length); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((current) => (current - 1 + results.length) % results.length); }
    if (event.key === 'Enter') { event.preventDefault(); go(results[active]); }
  }

  const showing = open && results.length > 0;

  return (
    <div className="workspace-search">
      <div className={`search-bar${open ? ' is-open' : ''}`}>
        <i className="bi bi-search" aria-hidden="true" />
        <input
          id="workspace-search"
          value={query}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          // Delayed so a click on a result registers before the list unmounts.
          onBlur={() => setTimeout(() => setOpen(false), 140)}
          onKeyDown={onKeyDown}
          placeholder="Search workspace"
          aria-label="Search workspace"
          aria-expanded={showing}
          aria-controls="workspace-search-results"
          role="combobox"
          aria-autocomplete="list"
        />
        <kbd aria-hidden="true">Ctrl K</kbd>
      </div>

      <AnimatePresence>
        {showing && (
          <motion.ul
            className="search-results"
            id="workspace-search-results"
            role="listbox"
            initial={{ opacity: 0, y: -8, scale: .98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: .98 }}
            transition={{ duration: .22, ease: [.16, 1, .3, 1] }}
          >
            {results.map((destination, index) => (
              <li key={destination.to} role="option" aria-selected={index === active}>
                <button
                  type="button"
                  className={index === active ? 'is-active' : ''}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => go(destination)}
                >
                  <i className={`bi ${destination.icon}`} aria-hidden="true" />
                  <span>
                    <strong>{destination.label}</strong>
                    <small>{destination.hint}</small>
                  </span>
                  <i className="bi bi-arrow-return-left" aria-hidden="true" />
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && query.trim() && results.length === 0 && (
          <motion.div
            className="search-results is-empty"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: .22 }}
            role="status"
          >
            <i className="bi bi-search" aria-hidden="true" />
            Nothing matches “{query.trim()}”
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
