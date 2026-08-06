// Supplier Intelligence from /analytics/suppliers/ and /suppliers/.
//
// The original page scored suppliers on delivery reliability — on-time rate,
// fill rate, price variance, average lead days, delayed deliveries. None of
// that can be computed: the backend has no Purchase or Delivery model, so no
// order has ever been recorded. Those fields are gone rather than guessed.
//
// What the API does know is each supplier's footprint: how much of the
// catalogue they cover and how much capital sits in their stock. The page is
// now built on that, plus the model's read on the products they supply.

const ISSUE_LABEL = {
  RESTOCK: 'Low stock',
  NEAR_EXPIRY_ACTION: 'Near expiry',
  DEAD_STOCK_ACTION: 'Dead stock',
  OVERSTOCK_REDUCTION: 'Overstocked',
};

const ISSUE_TONE = {
  RESTOCK: 'danger',
  NEAR_EXPIRY_ACTION: 'danger',
  DEAD_STOCK_ACTION: 'warning',
  OVERSTOCK_REDUCTION: 'warning',
};

function statusFrom(supplier, atRisk) {
  if (supplier.status !== 'ACTIVE') return 'risk';
  if (atRisk > 0) return 'watch';
  if (supplier.products >= 2) return 'preferred';
  return 'reliable';
}

/** Join the analytics footprint with contact details and product health. */
export function toSuppliers(analytics, suppliers, products, recommendations) {
  const detailsById = {};
  suppliers.forEach((row) => { detailsById[row.id] = row; });

  // Which supplier each product belongs to, so alerts can be attributed.
  const supplierByProduct = {};
  products.forEach((product) => { supplierByProduct[product.id] = product.supplier; });

  // Which of this supplier's products the model flagged, and why. Kept whole
  // rather than as a count, so the card's warning can be opened and read.
  const atRiskBySupplier = {};
  recommendations.forEach((item) => {
    if (item.recommendation_type === 'HEALTHY_INVENTORY') return;
    const supplierId = supplierByProduct[item.product_id];
    if (supplierId === undefined) return;
    if (!atRiskBySupplier[supplierId]) atRiskBySupplier[supplierId] = [];
    atRiskBySupplier[supplierId].push({
      id: item.product_id,
      name: item.product_name,
      type: ISSUE_LABEL[item.recommendation_type] || 'Needs review',
      tone: ISSUE_TONE[item.recommendation_type] || 'muted',
      priority: item.recommendation_priority,
      reason: item.recommendation_message,
      evidence: `${item.current_stock} in stock against predicted demand of ${item.predicted_quantity}.`,
    });
  });

  const totalValue = analytics.reduce((sum, row) => sum + row.stock_value, 0) || 1;

  return analytics.map((row) => {
    const details = detailsById[row.id] || {};
    const atRiskProducts = atRiskBySupplier[row.id] || [];
    const atRisk = atRiskProducts.length;

    return {
      id: row.id,
      name: row.supplier_name,
      code: `SUP-${String(row.id).padStart(3, '0')}`,
      phone: details.phone || '—',
      email: details.email || '—',
      address: details.address || '—',
      products: row.products,
      units: row.available_quantity,
      stockValue: row.stock_value,
      // Share of all capital held across suppliers, as a 0-100 figure.
      share: Math.round((row.stock_value / totalValue) * 100),
      atRisk,
      atRiskProducts,
      active: row.status === 'ACTIVE',
      status: statusFrom(row, atRisk),
      initials: row.supplier_name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase(),
    };
  });
}

/** The hero brief, every figure read off the joined rows. */
export function supplierIntelligence(suppliers) {
  if (suppliers.length === 0) {
    return { totalValue: 0, active: 0, needsAttention: 0, preferred: 0, healthScore: 0, lines: [] };
  }

  const byValue = [...suppliers].sort((a, b) => b.stockValue - a.stockValue);
  const byProducts = [...suppliers].sort((a, b) => b.products - a.products);
  const byRisk = [...suppliers].sort((a, b) => b.atRisk - a.atRisk);

  const largest = byValue[0];
  const broadest = byProducts[0];
  const riskiest = byRisk[0];
  const active = suppliers.filter((supplier) => supplier.active).length;
  const needsAttention = suppliers.filter((supplier) => supplier.atRisk > 0).length;
  const totalValue = suppliers.reduce((sum, supplier) => sum + supplier.stockValue, 0);

  const preferred = suppliers.filter((supplier) => supplier.status === 'preferred').length;
  // Share of suppliers whose products are all in good shape. Replaces the old
  // reliability average, which needed delivery records that do not exist.
  const healthScore = Math.round(((suppliers.length - needsAttention) / suppliers.length) * 100);

  return {
    totalValue,
    active,
    needsAttention,
    preferred,
    healthScore,
    lines: [
      { id: 'value', text: `Most capital held: ${largest.name} (₹${Math.round(largest.stockValue).toLocaleString('en-IN')}).`, highlight: [largest.id] },
      { id: 'breadth', text: `Widest coverage: ${broadest.name} supplies ${broadest.products} product(s).`, highlight: [broadest.id] },
      { id: 'risk', text: riskiest.atRisk > 0
        ? `${riskiest.name} supplies ${riskiest.atRisk} product(s) that need attention.`
        : 'No supplier currently has products needing attention.',
      highlight: riskiest.atRisk > 0 ? [riskiest.id] : [] },
      { id: 'active', text: `${active} of ${suppliers.length} suppliers are active.`, highlight: [] },
    ],
  };
}
