// Product Intelligence, built from the same join the inventory table uses.
//
// Demand trend, sparklines, purchase cost and margin are absent: the API
// exposes no per-product sales history and Product has no cost field, so there
// is nothing to compute them from. The AI score below is a stock-cover score
// derived from the model's predicted demand, which is real.

const CATEGORY_META = {
  Dairy: { icon: 'bi-cup-straw', tone: 'sage' },
  Bakery: { icon: 'bi-basket', tone: 'gold' },
  Groceries: { icon: 'bi-box-seam', tone: 'olive' },
  Household: { icon: 'bi-house-gear', tone: 'primary' },
  'Personal Care': { icon: 'bi-droplet', tone: 'info' },
  Beverages: { icon: 'bi-cup-hot', tone: 'warning' },
  Snacks: { icon: 'bi-cookie', tone: 'gold' },
  'Frozen Food': { icon: 'bi-snow', tone: 'info' },
  Medicine: { icon: 'bi-capsule', tone: 'danger' },
  Stationery: { icon: 'bi-pencil', tone: 'primary' },
};

const DEFAULT_META = { icon: 'bi-tag', tone: 'olive' };

/** How well current stock covers predicted demand, as a 0-100 score. */
function coverageScore(stock, predicted) {
  if (predicted === null || predicted === undefined) return 50;
  if (predicted === 0) return stock === 0 ? 50 : 60;
  const ratio = stock / predicted;
  // One to two times predicted demand is the healthy band and scores highest;
  // running dry or sitting on many times the demand both score lower.
  if (ratio >= 1 && ratio <= 2) return 95;
  if (ratio >= 0.75 && ratio < 1) return 78;
  if (ratio > 2 && ratio <= 4) return 66;
  if (ratio >= 0.4 && ratio < 0.75) return 52;
  return ratio < 0.4 ? 32 : 40;
}

function statusFrom(analysis) {
  if (!analysis) return 'steady';
  if (analysis.expiry_status === 'EXPIRED' || analysis.expiry_status === 'NEAR_EXPIRY') return 'action';
  if (analysis.stock_status === 'LOW_STOCK') return 'action';
  if (analysis.recommendation_type === 'DEAD_STOCK_ACTION') return 'slow';
  if (analysis.stock_status === 'OVERSTOCK') return 'slow';
  return 'performing';
}

export function toProducts(products, inventory, categories, recommendations) {
  const stockByProduct = {};
  inventory.forEach((row) => { stockByProduct[row.product] = row; });

  const categoryById = {};
  categories.forEach((row) => { categoryById[row.id] = row.category_name; });

  const analysisByProduct = {};
  recommendations.forEach((row) => { analysisByProduct[row.product_id] = row; });

  return products.map((product) => {
    const stock = (stockByProduct[product.id] || {}).available_quantity || 0;
    const analysis = analysisByProduct[product.id];
    const category = categoryById[product.category] || 'Uncategorised';
    const meta = CATEGORY_META[category] || DEFAULT_META;
    const price = Number(product.selling_price);
    const predicted = analysis ? analysis.predicted_quantity : null;

    return {
      id: product.id,
      name: product.product_name,
      brand: product.brand || '—',
      category,
      unit: product.unit,
      stock,
      minStock: product.minimum_stock,
      price,
      value: stock * price,
      predicted,
      score: coverageScore(stock, predicted),
      status: statusFrom(analysis),
      initials: product.product_name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase(),
      icon: meta.icon,
      tone: meta.tone,
    };
  });
}

/** Distinct category names for the filter row. */
export function toCategories(products) {
  return [...new Set(products.map((product) => product.category))].sort();
}

/** The hero brief, every figure read off the joined rows. */
export function productIntelligence(products) {
  if (products.length === 0) {
    return { averageScore: 0, performing: 0, needsAction: 0, catalogValue: 0, lines: [] };
  }

  const byValue = [...products].sort((a, b) => b.value - a.value);
  const byScore = [...products].sort((a, b) => b.score - a.score);
  const valuable = byValue[0];
  const best = byScore[0];
  const worst = byScore[byScore.length - 1];

  const performing = products.filter((product) => product.status === 'performing').length;
  const needsAction = products.filter((product) => product.status === 'action').length;
  const slow = products.filter((product) => product.status === 'slow').length;
  const averageScore = Math.round(
    products.reduce((sum, product) => sum + product.score, 0) / products.length,
  );

  return {
    averageScore,
    performing,
    needsAction,
    catalogValue: products.reduce((sum, product) => sum + product.value, 0),
    lines: [
      { id: 'best', text: `Best stock cover: ${best.name} (score ${best.score}).`, highlight: [best.id], filter: { status: 'performing' } },
      { id: 'worst', text: `Weakest stock cover: ${worst.name} (score ${worst.score}).`, highlight: [worst.id], filter: { status: 'action' } },
      { id: 'value', text: `Highest inventory value: ${valuable.name} (₹${Math.round(valuable.value).toLocaleString('en-IN')}).`, highlight: [valuable.id], filter: { category: valuable.category } },
      { id: 'slow', text: `${slow} product(s) are moving slowly against predicted demand.`, highlight: [], filter: { status: 'slow' } },
    ],
  };
}
