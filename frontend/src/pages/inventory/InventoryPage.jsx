import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Pagination from '../../components/ui/Pagination';
import {
  FilterPanel, InventoryIntelligence, InventoryRecommendations, InventoryTable,
  InventoryToolbar, PRODUCTS, ProductDrawer, SummaryCards, inventoryIntelligence,
} from '../../components/inventory';
import '../../styles/inventory.css';

const EASE = [.16, 1, .3, 1];
const PAGE_SIZE = 8;
const DEFAULT_FILTERS = { category: 'all', supplier: 'all', status: 'all', stock: 'all', expiry: 'all' };
const DEFAULT_COLUMNS = ['name', 'category', 'supplier', 'available', 'value', 'expiry', 'status'];

const intelligence = inventoryIntelligence(PRODUCTS);

function applyFilters(products, query, filters) {
  const term = query.trim().toLowerCase();
  return products.filter((product) => {
    if (term && ![product.name, product.brand, product.barcode, product.category, product.supplier]
      .some((field) => String(field).toLowerCase().includes(term))) return false;
    if (filters.category !== 'all' && product.category !== filters.category) return false;
    if (filters.supplier !== 'all' && product.supplier !== filters.supplier) return false;
    if (filters.status !== 'all' && product.status !== filters.status) return false;
    if (filters.stock === 'out' && product.available > 0) return false;
    if (filters.stock === 'below' && product.available > product.minStock) return false;
    if (filters.stock === 'healthy' && product.available <= product.minStock) return false;
    if (filters.expiry !== 'all' && product.expiryInDays > Number(filters.expiry)) return false;
    return true;
  });
}

function applySort(products, sort) {
  const key = sort.key === 'expiry' ? 'expiryInDays' : sort.key;
  return [...products].sort((a, b) => {
    const left = a[key];
    const right = b[key];
    const compared = typeof left === 'number' ? left - right : String(left).localeCompare(String(right));
    return sort.direction === 'asc' ? compared : -compared;
  });
}

export default function InventoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tableReady, setTableReady] = useState(false);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [sort, setSort] = useState({ key: 'status', direction: 'asc' });
  const [page, setPage] = useState(1);

  const [drawerProduct, setDrawerProduct] = useState(null);
  const [drawerTab, setDrawerTab] = useState('details');

  // Placeholder settle so the skeleton rows are a real state.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const filtered = applySort(applyFilters(PRODUCTS, query, filters), sort);
  const totalPages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1);
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const activeFilterCount = Object.entries(filters).filter(([, value]) => value !== 'all').length;

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Clicking a line in the hero brief filters the table to those rows.
  function handleInsight(status) {
    setFilters({ ...DEFAULT_FILTERS, status });
    setFiltersOpen(true);
    setPage(1);
    scrollTo('inventory-table');
  }

  function handleSummary(status) {
    setFilters({ ...DEFAULT_FILTERS, status: status === 'all' ? 'all' : status });
    setPage(1);
    scrollTo('inventory-table');
  }

  function handleSort(key) {
    setSort((current) => (
      current.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    ));
    setPage(1);
  }

  function toggleColumn(id) {
    setColumns((current) => (current.includes(id) ? current.filter((column) => column !== id) : [...current, id]));
  }

  function openDrawer(product, tab = 'details') {
    setDrawerProduct(product);
    setDrawerTab(tab);
  }

  return (
    <div className="inv">
      <InventoryIntelligence
        intelligence={intelligence}
        onInsight={handleInsight}
        onReady={() => setTableReady(true)}
        onScrollTo={scrollTo}
      />

      {/* The rest reveals once the brief has finished analysing. */}
      <AnimatePresence>
        {tableReady && (
          <motion.div
            className="inv-reveal"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, ease: EASE }}
          >
            <SummaryCards
              products={PRODUCTS}
              intelligence={intelligence}
              statusFilter={filters.status}
              onSelect={handleSummary}
            />

            <section className="inv-panel" id="inventory-table">
              <InventoryToolbar
                query={query}
                onQuery={(value) => { setQuery(value); setPage(1); }}
                filtersOpen={filtersOpen}
                onToggleFilters={() => setFiltersOpen(!filtersOpen)}
                activeFilterCount={activeFilterCount}
                visibleColumns={columns}
                onToggleColumn={toggleColumn}
                total={PRODUCTS.length}
                shown={filtered.length}
              />

              <FilterPanel
                open={filtersOpen}
                filters={filters}
                activeCount={activeFilterCount}
                onChange={(next) => { setFilters(next); setPage(1); }}
                onReset={() => { setFilters(DEFAULT_FILTERS); setQuery(''); setPage(1); }}
              />

              <InventoryTable
                products={visible}
                columns={columns}
                sort={sort}
                onSort={handleSort}
                loading={loading}
                error={error}
                onRetry={() => { setError(false); setLoading(true); setTimeout(() => setLoading(false), 800); }}
                highlight={filters.status !== 'all' ? filters.status : null}
                onView={(product) => openDrawer(product, 'details')}
                onEdit={(product) => openDrawer(product, 'edit')}
                onHistory={(product) => openDrawer(product, 'history')}
              />

              {!loading && filtered.length > PAGE_SIZE && (
                <div className="inv-pagination">
                  <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
                </div>
              )}
            </section>

            <InventoryRecommendations />
          </motion.div>
        )}
      </AnimatePresence>

      <ProductDrawer product={drawerProduct} tab={drawerTab} onTab={setDrawerTab} onClose={() => setDrawerProduct(null)} />
    </div>
  );
}
