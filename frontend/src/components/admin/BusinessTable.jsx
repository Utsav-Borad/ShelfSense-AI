import { motion } from 'framer-motion';
import Table from '../ui/Table';
import EmptyState from '../ui/EmptyState';

const EASE = [.16, 1, .3, 1];

// Every shop on the platform, with who owns it and what it holds. A shop with
// no products has registered but never imported anything, which is the one
// thing worth spotting here.
export default function BusinessTable({ businesses, total, query, onQuery, onReset, filtered }) {
  return (
    <section className="ad-panel" aria-label="Businesses">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">Businesses</p>
          <h2>{total} shops registered</h2>
        </div>
        <span className="ad-count">{businesses.length} shown</span>
      </header>

      <div className="ad-filters">
        <div className="ad-search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search shop, type or owner"
            aria-label="Search businesses"
          />
          {query && (
            <button type="button" onClick={() => onQuery('')} aria-label="Clear search">
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          )}
        </div>

        {filtered && (
          <button type="button" className="ad-btn ad-btn-ghost" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />Clear
          </button>
        )}
      </div>

      {businesses.length === 0 ? (
        <div className="ad-state">
          <EmptyState icon="bi-shop" title="No businesses match" description="Try a different search term, or clear the filter." />
        </div>
      ) : (
        <Table columns={['Shop', 'Owner', 'Catalogue', 'Sales', 'Revenue', 'Latest sale']}>
          {businesses.map((business, index) => (
            <motion.tr
              key={business.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .35, delay: Math.min(index, 10) * .04, ease: EASE }}
            >
              <td>
                <span className="ad-shop-cell">
                  <strong>{business.name}</strong>
                  <small>{business.type} · set up {business.created}</small>
                </span>
              </td>
              <td>
                <span className="ad-shop-cell">
                  <strong>{business.owner.name}</strong>
                  <small>{business.owner.email}</small>
                </span>
              </td>
              <td>
                {business.products === 0
                  ? <span className="ad-none">Nothing imported</span>
                  : `${business.products} products · ${business.suppliers} suppliers`}
              </td>
              <td>{business.salesRecords.toLocaleString('en-IN')}</td>
              <td>{business.revenueLabel}</td>
              <td>{business.lastSale}</td>
            </motion.tr>
          ))}
        </Table>
      )}
    </section>
  );
}
