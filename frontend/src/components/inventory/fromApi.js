// Joins the four inventory endpoints into the row shape the table renders.
//
// /inventory/ returns `product` as an id, and categories and suppliers are ids
// on the product, so the join happens here. Status comes from the model's own
// analysis (/ai/recommendations/) rather than being re-derived in JavaScript —
// the backend already decided what counts as low, expiring or dead.

function daysUntil(isoDate) {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split('-').map(Number);
  const expiry = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((expiry - today) / 86400000);
}

function statusFrom(analysis) {
  if (!analysis) return 'healthy';
  if (analysis.expiry_status === 'EXPIRED' || analysis.expiry_status === 'NEAR_EXPIRY') return 'expiring';
  if (analysis.recommendation_type === 'DEAD_STOCK_ACTION') return 'dead';
  if (analysis.stock_status === 'LOW_STOCK') return 'low';
  if (analysis.stock_status === 'OVERSTOCK') return 'overstock';
  return 'healthy';
}

/** Build the product rows. Every argument is the `data` from its endpoint. */
export function toProducts(products, inventory, categories, suppliers, recommendations) {
  const stockByProduct = {};
  inventory.forEach((row) => { stockByProduct[row.product] = row; });

  const categoryById = {};
  categories.forEach((row) => { categoryById[row.id] = row.category_name; });

  const supplierById = {};
  suppliers.forEach((row) => { supplierById[row.id] = row.supplier_name; });

  const analysisByProduct = {};
  recommendations.forEach((row) => { analysisByProduct[row.product_id] = row; });

  return products.map((product) => {
    const stock = stockByProduct[product.id] || {
      available_quantity: 0, reserved_quantity: 0, damaged_quantity: 0,
    };
    const analysis = analysisByProduct[product.id];
    const price = Number(product.selling_price);
    const available = stock.available_quantity;
    const expiryInDays = daysUntil(product.expiry_date);

    return {
      id: product.id,
      barcode: product.barcode || '—',
      name: product.product_name,
      brand: product.brand || '—',
      category: categoryById[product.category] || 'Uncategorised',
      supplier: supplierById[product.supplier] || 'Unknown supplier',
      unit: product.unit,
      mrp: Number(product.mrp),
      price,
      available,
      reserved: stock.reserved_quantity,
      damaged: stock.damaged_quantity,
      minStock: product.minimum_stock,
      expiryDate: product.expiry_date || '—',
      // A product with no expiry date is treated as far from expiring so it
      // never trips the "near expiry" styling.
      expiryInDays: expiryInDays === null ? 9999 : expiryInDays,
      // Valued at selling price: the API exposes no purchase cost.
      value: available * price,
      status: statusFrom(analysis),
      // Kept for the drawer, straight from the model.
      predictedQuantity: analysis ? analysis.predicted_quantity : null,
      stockStatus: analysis ? analysis.stock_status : null,
    };
  });
}

/** Distinct category and supplier names, for the filter dropdowns. */
export function toFilterOptions(products) {
  const categories = [...new Set(products.map((product) => product.category))].sort();
  const suppliers = [...new Set(products.map((product) => product.supplier))].sort();
  return { categories, suppliers };
}

const RECOMMENDATION_STYLE = {
  RESTOCK: { icon: 'bi-arrow-repeat', tone: 'gold', verb: 'Reorder' },
  NEAR_EXPIRY_ACTION: { icon: 'bi-tag', tone: 'warning', verb: 'Act on expiry for' },
  DEAD_STOCK_ACTION: { icon: 'bi-box2-heart', tone: 'danger', verb: 'Review dead stock:' },
  OVERSTOCK_REDUCTION: { icon: 'bi-box-seam', tone: 'sage', verb: 'Reduce ordering of' },
};

const PRIORITY_LABEL = { CRITICAL: 'Critical', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };

/** The three most urgent recommendations, shaped for the cards. */
export function toRecommendations(recommendations, limit = 3) {
  return recommendations
    .filter((item) => RECOMMENDATION_STYLE[item.recommendation_type])
    .slice(0, limit)
    .map((item, index) => {
      const style = RECOMMENDATION_STYLE[item.recommendation_type];
      return {
        id: `${item.product_id}-${index}`,
        priority: PRIORITY_LABEL[item.recommendation_priority] || item.recommendation_priority,
        tone: style.tone,
        icon: style.icon,
        title: `${style.verb} ${item.product_name}`,
        reason: item.recommendation_message,
        impact: `${item.current_stock} in stock against predicted demand of ${item.predicted_quantity}.`,
      };
    });
}

/** Hero figures, derived from the joined rows. */
export function inventoryIntelligence(products) {
  const counts = products.reduce((totals, product) => (
    { ...totals, [product.status]: (totals[product.status] || 0) + 1 }
  ), {});
  const healthy = counts.healthy || 0;
  const low = counts.low || 0;
  const expiring = counts.expiring || 0;
  const dead = counts.dead || 0;
  const overstock = counts.overstock || 0;

  const urgent = products.filter((product) => product.expiryInDays <= 3);
  const expiringValue = Math.round(
    products.filter((product) => product.status === 'expiring')
      .reduce((sum, product) => sum + product.value, 0),
  );
  const deadValue = products.filter((product) => product.status === 'dead')
    .reduce((sum, product) => sum + product.value, 0);

  const total = products.length || 1;
  const score = Math.max(0, Math.min(100, Math.round((healthy / total) * 100)));

  let status = 'At risk';
  if (score >= 85) status = 'Excellent';
  else if (score >= 70) status = 'Good';
  else if (score >= 50) status = 'Needs attention';

  let tone = 'danger';
  if (score >= 85) tone = 'success';
  else if (score >= 70) tone = 'olive';
  else if (score >= 50) tone = 'warning';

  return {
    score,
    status,
    tone,
    totalValue: products.reduce((sum, product) => sum + product.value, 0),
    deadValue,
    lines: [
      { id: 'healthy', filter: 'healthy', icon: 'bi-check-lg', text: `${healthy} products are healthy.` },
      { id: 'low', filter: 'low', icon: 'bi-check-lg', text: `${low} products require restocking.` },
      { id: 'overstock', filter: 'overstock', icon: 'bi-check-lg', text: `${overstock} products are overstocked against predicted demand.` },
      { id: 'expiring', filter: 'expiring', icon: 'bi-check-lg', text: `${expiring} products are near expiry, ${urgent.length} within 3 days.` },
      { id: 'value', filter: 'expiring', icon: 'bi-check-lg', text: `₹${(expiringValue + Math.round(deadValue)).toLocaleString('en-IN')} of stock is at expiry or dead-stock risk.` },
    ],
  };
}
