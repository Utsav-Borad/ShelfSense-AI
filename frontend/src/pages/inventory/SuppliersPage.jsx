import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import {
  SupplierCard, SupplierDrawer, SupplierIntelligence,
  SupplierTable, SupplierToolbar,
} from '../../components/suppliers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { supplierIntelligence, toSuppliers } from '../../components/suppliers/fromApi';
import { getRecommendations } from '../../services/aiService';
import { getSupplierAnalytics } from '../../services/analyticsService';
import { getProducts, getSuppliers } from '../../services/inventoryService';
import '../../styles/suppliers.css';

const EASE = [.16, 1, .3, 1];

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
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('share');
  const [view, setView] = useState('grid');
  const [highlighted, setHighlighted] = useState([]);
  const [openSupplier, setOpenSupplier] = useState(null);

  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [analytics, details, products, ai] = await Promise.all([
          getSupplierAnalytics(), getSuppliers(), getProducts(), getRecommendations(),
        ]);
        if (!active) return;
        setSuppliers(toSuppliers(analytics.data.suppliers, details.data, products.data, ai.data.recommendations));
        setError(false);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  const intelligence = supplierIntelligence(suppliers);

  const term = query.trim().toLowerCase();
  const filtered = suppliers
    .filter((supplier) => {
      if (term && ![supplier.name, supplier.code, supplier.email]
        .some((field) => String(field).toLowerCase().includes(term))) return false;
      if (status !== 'all' && supplier.status !== status) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      return b[sort] - a[sort];
    });

  const isFiltered = Boolean(term) || status !== 'all' || highlighted.length > 0;

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

  if (loading) {
    return <div className="sp"><LoadingSpinner label="Reading your supply base" /></div>;
  }

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
                status={status}
                onStatus={clearHighlight(setStatus)}
                sort={sort}
                onSort={setSort}
                view={view}
                onView={setView}
                total={suppliers.length}
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
