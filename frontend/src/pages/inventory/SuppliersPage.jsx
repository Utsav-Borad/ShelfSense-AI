import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import {
  SUPPLIERS, SupplierCard, SupplierDrawer, SupplierIntelligence,
  SupplierTable, SupplierToolbar, supplierIntelligence,
} from '../../components/suppliers';
import '../../styles/suppliers.css';

const EASE = [.16, 1, .3, 1];
const intelligence = supplierIntelligence(SUPPLIERS);

function SupplierSkeleton({ view }) {
  return (
    <div className={view === 'grid' ? 'sp-grid' : 'sp-skeleton-list'} aria-busy="true" aria-label="Loading suppliers">
      {[0, 1, 2, 3, 4, 5].map((n) => <span className={`sp-sk ${view === 'grid' ? 'sp-sk-card' : 'sp-sk-row'}`} key={n} />)}
    </div>
  );
}

export default function SuppliersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [delivery, setDelivery] = useState('all');
  const [delays, setDelays] = useState('all');
  const [sort, setSort] = useState('reliability');
  const [view, setView] = useState('grid');
  const [highlighted, setHighlighted] = useState([]);
  const [openSupplier, setOpenSupplier] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const term = query.trim().toLowerCase();
  const filtered = SUPPLIERS
    .filter((supplier) => {
      if (term && ![supplier.name, supplier.code, ...supplier.categories]
        .some((field) => field.toLowerCase().includes(term))) return false;
      if (category !== 'all' && !supplier.categories.includes(category)) return false;
      if (status !== 'all' && supplier.status !== status) return false;
      if (delivery !== 'all' && supplier.avgDays > Number(delivery)) return false;
      if (delays === 'clean' && supplier.delayedRecent > 0) return false;
      if (delays === 'delayed' && supplier.delayedRecent === 0) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'avgDays') return a.avgDays - b.avgDays;
      return b[sort] - a[sort];
    });

  const isFiltered = Boolean(term) || category !== 'all' || status !== 'all'
    || delivery !== 'all' || delays !== 'all' || highlighted.length > 0;

  // A brief line applies its filter and marks the supplier it named, so the
  // reader can see exactly who the sentence was about.
  function handleInsight(line) {
    setStatus(line.filter.status || 'all');
    setCategory('all');
    setDelivery('all');
    setDelays('all');
    setQuery('');
    setHighlighted(line.highlight || []);
    document.getElementById('supplier-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetFilters() {
    setQuery('');
    setCategory('all');
    setStatus('all');
    setDelivery('all');
    setDelays('all');
    setHighlighted([]);
  }

  const clearHighlight = (setter) => (value) => { setter(value); setHighlighted([]); };

  return (
    <div className="sp">
      <SupplierIntelligence
        intelligence={intelligence}
        onInsight={handleInsight}
        onReady={() => setReady(true)}
      />

      <AnimatePresence>
        {ready && (
          <motion.div
            className="sp-reveal"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, ease: EASE }}
          >
            <section className="sp-panel" id="supplier-results">
              <SupplierToolbar
                query={query}
                onQuery={clearHighlight(setQuery)}
                category={category}
                onCategory={clearHighlight(setCategory)}
                status={status}
                onStatus={clearHighlight(setStatus)}
                delivery={delivery}
                onDelivery={clearHighlight(setDelivery)}
                delays={delays}
                onDelays={clearHighlight(setDelays)}
                sort={sort}
                onSort={setSort}
                view={view}
                onView={setView}
                total={SUPPLIERS.length}
                shown={filtered.length}
                filtered={isFiltered}
                onReset={resetFilters}
              />

              {error && (
                <div className="sp-state">
                  <ErrorState title="We could not load your suppliers" description="Something went wrong on the way. Try again in a moment." />
                  <button type="button" className="sp-btn" onClick={() => { setError(false); setLoading(true); setTimeout(() => setLoading(false), 800); }}>
                    <i className="bi bi-arrow-clockwise" aria-hidden="true" />Try again
                  </button>
                </div>
              )}

              {!error && loading && <SupplierSkeleton view={view} />}

              {!error && !loading && filtered.length === 0 && (
                <div className="sp-state">
                  <EmptyState icon="bi-truck" title="No suppliers match" description="Try a different search term, or clear the filters." />
                  <button type="button" className="sp-btn" onClick={resetFilters}>
                    <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />Clear filters
                  </button>
                </div>
              )}

              {!error && !loading && filtered.length > 0 && (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={view}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: .3, ease: EASE }}
                  >
                    {view === 'grid' ? (
                      <div className="sp-grid">
                        {filtered.map((supplier, index) => (
                          <SupplierCard
                            key={supplier.id}
                            supplier={supplier}
                            index={index}
                            highlighted={highlighted.includes(supplier.id)}
                            onOpen={setOpenSupplier}
                          />
                        ))}
                      </div>
                    ) : (
                      <SupplierTable suppliers={filtered} highlighted={highlighted} onOpen={setOpenSupplier} />
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <SupplierDrawer supplier={openSupplier} onClose={() => setOpenSupplier(null)} />
    </div>
  );
}
