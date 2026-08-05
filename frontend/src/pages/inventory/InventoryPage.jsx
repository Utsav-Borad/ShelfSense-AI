import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorState from '../../components/ui/ErrorState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import {
  FilterPanel, InventoryIntelligence, InventoryRecommendations, InventoryTable,
  InventoryToolbar, ProductDrawer, SummaryCards,
} from '../../components/inventory';
import {
  inventoryIntelligence, toFilterOptions, toProducts, toRecommendations,
} from '../../components/inventory/fromApi';
import { getRecommendations } from '../../services/aiService';
import {
  getCategories, getInventory, getProducts, getSuppliers,
} from '../../services/inventoryService';
import '../../styles/inventory.css';

const EASE = [.16, 1, .3, 1];
const PAGE_SIZE = 8;
const DEFAULT_FILTERS = { category: 'all', supplier: 'all', status: 'all', stock: 'all', expiry: 'all' };
const DEFAULT_COLUMNS = ['name', 'category', 'supplier', 'available', 'value', 'expiry', 'status'];

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
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [sort, setSort] = useState({ key: 'status', direction: 'asc' });
  const [page, setPage] = useState(1);

  const [drawerProduct, setDrawerProduct] = useState(null);
  const [drawerTab, setDrawerTab] = useState('details');
  // Bumped by the table's retry button to re-run the fetch.
  const [reloadKey, setReloadKey] = useState(0);

  // Products, stock, the names behind the ids, and the model's own read on
  // each product — joined into one row set by components/inventory/fromApi.js.
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [productList, stock, categories, suppliers, ai] = await Promise.all([
          getProducts(), getInventory(), getCategories(), getSuppliers(), getRecommendations(),
        ]);
        if (!active) return;
        const advice = ai.data.recommendations;
        setProducts(toProducts(productList.data, stock.data, categories.data, suppliers.data, advice));
        setRecommendations(toRecommendations(advice));
        setError(false);
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [reloadKey]);

  const intelligence = inventoryIntelligence(products);
  const { categories: categoryOptions, suppliers: supplierOptions } = toFilterOptions(products);
  const filtered = applySort(applyFilters(products, query, filters), sort);
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

  // The hero animates its numbers on mount, so showing it before the data
  // arrives would count up to a confident set of zeros. Wait for the fetch.
  if (loading) {
    return (
      <div className="inv">
        <LoadingSpinner label="Analysing your inventory" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="inv">
        <ErrorState
          title="We could not load your inventory"
          description="Check that the backend is running, then try again."
        />
      </div>
    );
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
              products={products}
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
                total={products.length}
                shown={filtered.length}
              />

              <FilterPanel
                open={filtersOpen}
                filters={filters}
                activeCount={activeFilterCount}
                onChange={(next) => { setFilters(next); setPage(1); }}
                onReset={() => { setFilters(DEFAULT_FILTERS); setQuery(''); setPage(1); }}
                categories={categoryOptions}
                suppliers={supplierOptions}
              />

              <InventoryTable
                products={visible}
                columns={columns}
                sort={sort}
                onSort={handleSort}
                loading={loading}
                error={error}
                onRetry={() => { setError(false); setLoading(true); setReloadKey((key) => key + 1); }}
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

            <InventoryRecommendations items={recommendations} />
          </motion.div>
        )}
      </AnimatePresence>

      <ProductDrawer product={drawerProduct} tab={drawerTab} onTab={setDrawerTab} onClose={() => setDrawerProduct(null)} />
    </div>
  );
}
