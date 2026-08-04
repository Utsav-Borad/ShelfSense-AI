import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import {
  PRODUCTS, ProductCard, ProductDrawer, ProductIntelligence, ProductTable,
  ProductToolbar, productIntelligence,
} from '../../components/products';
import '../../styles/products.css';

const EASE = [.16, 1, .3, 1];
const intelligence = productIntelligence(PRODUCTS);

function ProductSkeleton({ view }) {
  const rows = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <div className={view === 'grid' ? 'pi-grid' : 'pi-skeleton-list'} aria-busy="true" aria-label="Loading products">
      {rows.map((n) => <span className={`pi-sk ${view === 'grid' ? 'pi-sk-card' : 'pi-sk-row'}`} key={n} />)}
    </div>
  );
}

export default function ProductsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('score');
  const [view, setView] = useState('grid');
  const [highlighted, setHighlighted] = useState([]);
  const [openProduct, setOpenProduct] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const term = query.trim().toLowerCase();
  const filtered = PRODUCTS
    .filter((product) => {
      if (term && ![product.name, product.brand, product.category].some((field) => field.toLowerCase().includes(term))) return false;
      if (category !== 'all' && product.category !== category) return false;
      if (status !== 'all' && product.status !== status) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      return b[sort] - a[sort];
    });

  const isFiltered = Boolean(term) || category !== 'all' || status !== 'all' || highlighted.length > 0;

  // A brief line applies its filter and marks the products it referred to, so
  // the reader can see exactly which rows the sentence was about.
  function handleInsight(line) {
    setCategory(line.filter.category || 'all');
    setStatus(line.filter.status || 'all');
    setHighlighted(line.highlight || []);
    setQuery('');
    document.getElementById('product-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function resetFilters() {
    setQuery('');
    setCategory('all');
    setStatus('all');
    setHighlighted([]);
  }

  return (
    <div className="pi">
      <ProductIntelligence
        intelligence={intelligence}
        onInsight={handleInsight}
        onReady={() => setReady(true)}
      />

      <AnimatePresence>
        {ready && (
          <motion.div
            className="pi-reveal"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, ease: EASE }}
          >
            <section className="pi-panel" id="product-results">
              <ProductToolbar
                query={query}
                onQuery={(value) => { setQuery(value); setHighlighted([]); }}
                category={category}
                onCategory={(value) => { setCategory(value); setHighlighted([]); }}
                status={status}
                onStatus={(value) => { setStatus(value); setHighlighted([]); }}
                sort={sort}
                onSort={setSort}
                view={view}
                onView={setView}
                total={PRODUCTS.length}
                shown={filtered.length}
                filtered={isFiltered}
                onReset={resetFilters}
              />

              {error && (
                <div className="pi-state">
                  <ErrorState title="We could not load your products" description="Something went wrong on the way. Try again in a moment." />
                  <button type="button" className="pi-btn" onClick={() => { setError(false); setLoading(true); setTimeout(() => setLoading(false), 800); }}>
                    <i className="bi bi-arrow-clockwise" aria-hidden="true" />Try again
                  </button>
                </div>
              )}

              {!error && loading && <ProductSkeleton view={view} />}

              {!error && !loading && filtered.length === 0 && (
                <div className="pi-state">
                  <EmptyState icon="bi-search" title="No products match" description="Try a different search term, or clear the filters." />
                  <button type="button" className="pi-btn" onClick={resetFilters}>
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
                      <div className="pi-grid">
                        {filtered.map((product, index) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            index={index}
                            highlighted={highlighted.includes(product.id)}
                            onOpen={setOpenProduct}
                          />
                        ))}
                      </div>
                    ) : (
                      <ProductTable products={filtered} highlighted={highlighted} onOpen={setOpenProduct} />
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <ProductDrawer product={openProduct} onClose={() => setOpenProduct(null)} />
    </div>
  );
}
