// Builds the executive reports from live figures.
//
// The backend aggregates sales into daily / weekly / monthly totals and can
// stream any of them as CSV. Four reports can be assembled from what the API
// actually exposes; PDF and Excel are not offered because nothing generates
// them, and period-on-period growth is absent because the API returns one
// window at a time with nothing to compare it against.

const rupees = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`;
const count = (value) => Math.round(value).toLocaleString('en-IN');

/** Overall health, using the same measure as the dashboard so they agree. */
export function toHealth(summary) {
  const analysed = summary.analysed_products || 0;
  const healthy = (summary.health_mix || {}).HEALTHY || 0;
  const score = analysed ? Math.round((healthy / analysed) * 100) : 0;

  let status = 'Needs attention';
  if (score >= 85) status = 'Excellent';
  else if (score >= 70) status = 'Healthy';
  else if (score >= 50) status = 'Mixed';

  return { score, status };
}

/** Headline figures for the period. No growth percentages: see the note above. */
export function toSummaryMetrics(report, summary) {
  const totals = report.totals;
  return [
    { id: 'revenue', icon: 'bi-graph-up-arrow', label: 'Revenue for the period', value: Math.round(totals.revenue), prefix: '₹', tone: 'success' },
    { id: 'units', icon: 'bi-box-seam', label: 'Units sold', value: totals.units_sold, tone: 'olive' },
    { id: 'basket', icon: 'bi-basket', label: 'Average order value', value: Math.round(totals.average_order_value), prefix: '₹', tone: 'gold' },
    { id: 'stock', icon: 'bi-cash-stack', label: 'Capital on the shelf', value: Math.round(summary.stock_value), prefix: '₹', tone: 'sage' },
    { id: 'attention', icon: 'bi-exclamation-triangle', label: 'Products needing attention', value: summary.low_stock + summary.overstock + summary.near_expiry + summary.expired, tone: 'warning', note: 'low stock, overstock or expiry' },
  ];
}

/** A written assessment, composed from the same numbers. */
export function toAssessment(report, summary) {
  const totals = report.totals;
  const attention = summary.low_stock + summary.overstock + summary.near_expiry + summary.expired;
  const parts = [
    `Over ${report.start_date} to ${report.end_date} you took ${rupees(totals.revenue)} across ${count(totals.invoices)} invoices, averaging ${rupees(totals.average_order_value)} per order.`,
  ];
  if (attention === 0) {
    parts.push('Every analysed product is within its stock and expiry limits.');
  } else {
    parts.push(`${attention} of ${summary.analysed_products} products need attention: ${summary.low_stock} below minimum stock, ${summary.overstock} overstocked and ${summary.near_expiry + summary.expired} at expiry risk.`);
  }
  return parts.join(' ');
}

/** The four reports the API can genuinely produce. */
export function toReports(report, summary, inventory, suppliers, recommendations) {
  const totals = report.totals;
  const breakdown = inventory.status_breakdown || {};

  const topSuppliers = [...suppliers.suppliers]
    .sort((a, b) => b.stock_value - a.stock_value)
    .slice(0, 4);

  const byType = {};
  recommendations.forEach((item) => {
    byType[item.recommendation_type] = (byType[item.recommendation_type] || 0) + 1;
  });

  return [
    {
      id: 'sales', title: 'Sales Report', icon: 'bi-receipt', tone: 'gold',
      summary: 'What sold, when, and what it earned across the period.',
      period: report.period,
      range: `${report.start_date} to ${report.end_date}`,
      headline: [
        { label: 'Revenue', value: rupees(totals.revenue) },
        { label: 'Units sold', value: count(totals.units_sold) },
        { label: 'Avg order', value: rupees(totals.average_order_value) },
      ],
      columns: ['Product', 'Units', 'Revenue'],
      rows: report.top_products.map((item) => [
        item.product_name, count(item.units_sold), rupees(item.revenue),
      ]),
      sections: ['Revenue by day', 'Top products', 'Units sold by day', 'Discount total'],
      exportable: true,
    },
    {
      id: 'inventory', title: 'Inventory Report', icon: 'bi-boxes', tone: 'olive',
      summary: 'Stock position, expiry exposure and where capital is sitting.',
      period: report.period,
      range: 'Current position',
      headline: [
        { label: 'Inventory value', value: rupees(inventory.stock_value) },
        { label: 'Products', value: count(summary.products) },
        { label: 'Near expiry', value: count(summary.near_expiry) },
      ],
      columns: ['Status', 'Products'],
      rows: [
        ['Healthy', count(breakdown.HEALTHY || 0)],
        ['Overstocked', count(breakdown.OVERSTOCK || 0)],
        ['Low stock', count(breakdown.LOW_STOCK || 0)],
        ['Near expiry', count(summary.near_expiry)],
      ],
      sections: ['Stock by status', 'Available, reserved and damaged units', 'Capital on the shelf'],
      exportable: false,
    },
    {
      id: 'supplier', title: 'Supplier Report', icon: 'bi-truck', tone: 'sage',
      summary: 'How much of your catalogue and capital each supplier carries.',
      period: report.period,
      range: 'Current position',
      headline: [
        { label: 'Suppliers', value: count(suppliers.count) },
        { label: 'Products covered', value: count(summary.products) },
        { label: 'Capital held', value: rupees(inventory.stock_value) },
      ],
      columns: ['Supplier', 'Products', 'Stock value'],
      rows: topSuppliers.map((item) => [
        item.supplier_name, count(item.products), rupees(item.stock_value),
      ]),
      sections: ['Products per supplier', 'Stock value per supplier', 'Active and inactive suppliers'],
      exportable: false,
    },
    {
      id: 'ai', title: 'AI Recommendation Report', icon: 'bi-stars', tone: 'gold',
      summary: 'Every decision the model raised, and the evidence behind it.',
      period: report.period,
      range: 'Current analysis',
      headline: [
        { label: 'Recommendations', value: count(recommendations.length) },
        { label: 'Reorder', value: count(byType.RESTOCK || 0) },
        { label: 'Overstock', value: count(byType.OVERSTOCK_REDUCTION || 0) },
      ],
      columns: ['Product', 'Type', 'Priority'],
      rows: recommendations
        .filter((item) => item.recommendation_type !== 'HEALTHY_INVENTORY')
        .slice(0, 4)
        .map((item) => [
          item.product_name,
          item.recommendation_type.replace(/_/g, ' ').toLowerCase(),
          item.recommendation_priority.toLowerCase(),
        ]),
      sections: ['Recommendations by type', 'Priority mix', 'Stock evidence per product'],
      exportable: false,
    },
  ];
}
