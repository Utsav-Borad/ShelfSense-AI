// Inventory placeholder data. Nothing here comes from an API.
//
// Expiry and last-sale are stored as day offsets rather than fixed dates, so
// the demo keeps reading correctly however long from now it is opened.

export const CATEGORIES = ['Dairy', 'Bakery', 'Packaged', 'Household', 'Personal care', 'Beverages'];
export const SUPPLIERS = ['Sharma Distributors', 'Gujarat Foods', 'Amul Depot', 'Nova Traders', 'Patel Agencies'];

// [barcode, name, brand, category, supplier, unit, mrp, price, cost,
//  available, reserved, damaged, minStock, expiryInDays, daysSinceSold]
const RAW = [
  ['8901000010017', 'Amul Butter 500g', 'Amul', 'Dairy', 'Amul Depot', '500 g', 275, 262, 214, 18, 2, 0, 24, 96, 0],
  ['8901000010024', 'Toned Milk 1L', 'Amul', 'Dairy', 'Amul Depot', '1 L', 68, 66, 54, 142, 8, 1, 60, 4, 0],
  ['8901000010031', 'Fresh Cream 250ml', 'Amul', 'Dairy', 'Amul Depot', '250 ml', 92, 88, 71, 34, 0, 2, 20, 2, 1],
  ['8901000010048', 'Paneer 200g', 'Amul', 'Dairy', 'Amul Depot', '200 g', 99, 95, 78, 26, 4, 0, 18, 6, 0],
  ['8901000010055', 'Cheese Slices 200g', 'Britannia', 'Dairy', 'Gujarat Foods', '200 g', 145, 139, 112, 12, 0, 0, 16, 21, 2],
  ['8901000020016', 'Brown Bread 400g', 'Britannia', 'Bakery', 'Gujarat Foods', '400 g', 55, 52, 41, 78, 6, 3, 30, 3, 0],
  ['8901000020023', 'Whole Wheat Bread', 'Modern', 'Bakery', 'Gujarat Foods', '400 g', 50, 48, 38, 41, 0, 1, 25, 3, 1],
  ['8901000020030', 'Rusk Toast 300g', 'Britannia', 'Bakery', 'Gujarat Foods', '300 g', 60, 58, 45, 96, 2, 0, 30, 84, 1],
  ['8901000020047', 'Cream Biscuits', 'Sunfeast', 'Bakery', 'Nova Traders', '150 g', 40, 38, 29, 210, 0, 0, 60, 168, 0],
  ['8901000020054', 'Multigrain Cookies', 'Unibic', 'Bakery', 'Nova Traders', '200 g', 85, 82, 64, 8, 0, 0, 20, 142, 71],
  ['8901000030015', 'Basmati Rice 5kg', 'India Gate', 'Packaged', 'Patel Agencies', '5 kg', 720, 689, 560, 34, 3, 0, 12, 310, 2],
  ['8901000030022', 'Toor Dal 1kg', 'Tata', 'Packaged', 'Patel Agencies', '1 kg', 185, 178, 142, 62, 0, 0, 25, 240, 1],
  ['8901000030039', 'Sunflower Oil 1L', 'Fortune', 'Packaged', 'Patel Agencies', '1 L', 155, 149, 121, 88, 4, 0, 30, 186, 0],
  ['8901000030046', 'Iodised Salt 1kg', 'Tata', 'Packaged', 'Patel Agencies', '1 kg', 28, 26, 19, 164, 0, 0, 50, 420, 1],
  ['8901000030053', 'Sugar 1kg', 'Madhur', 'Packaged', 'Patel Agencies', '1 kg', 52, 49, 40, 9, 0, 0, 40, 365, 3],
  ['8901000030060', 'Poha 500g', 'Local', 'Packaged', 'Nova Traders', '500 g', 45, 42, 32, 71, 0, 2, 25, 121, 44],
  ['8901000030077', 'Instant Noodles Pack', 'Maggi', 'Packaged', 'Nova Traders', '280 g', 60, 58, 44, 186, 0, 0, 60, 154, 0],
  ['8901000030084', 'Cornflakes 475g', 'Kellogg’s', 'Packaged', 'Nova Traders', '475 g', 220, 210, 168, 7, 0, 1, 15, 118, 68],
  ['8901000030091', 'Peanut Butter 340g', 'Pintola', 'Packaged', 'Nova Traders', '340 g', 310, 295, 238, 4, 0, 0, 12, 96, 82],
  ['8901000040014', 'Detergent Powder 1kg', 'Surf Excel', 'Household', 'Sharma Distributors', '1 kg', 128, 122, 96, 54, 2, 0, 20, 540, 1],
  ['8901000040021', 'Dishwash Gel 750ml', 'Vim', 'Household', 'Sharma Distributors', '750 ml', 165, 158, 126, 38, 0, 0, 18, 480, 2],
  ['8901000040038', 'Floor Cleaner 1L', 'Lizol', 'Household', 'Sharma Distributors', '1 L', 195, 186, 149, 6, 0, 0, 14, 510, 4],
  ['8901000040045', 'Toilet Cleaner 500ml', 'Harpic', 'Household', 'Sharma Distributors', '500 ml', 98, 94, 74, 46, 0, 1, 20, 495, 2],
  ['8901000040052', 'Garbage Bags 30pc', 'Origami', 'Household', 'Sharma Distributors', '30 pc', 149, 142, 112, 11, 0, 0, 15, 620, 66],
  ['8901000050013', 'Shampoo 340ml', 'Dove', 'Personal care', 'Sharma Distributors', '340 ml', 399, 379, 302, 22, 1, 0, 12, 380, 3],
  ['8901000050020', 'Bathing Soap 4x100g', 'Lux', 'Personal care', 'Sharma Distributors', '4 x 100 g', 180, 172, 136, 64, 0, 0, 24, 420, 1],
  ['8901000050037', 'Toothpaste 200g', 'Colgate', 'Personal care', 'Sharma Distributors', '200 g', 122, 116, 92, 48, 2, 0, 20, 400, 0],
  ['8901000050044', 'Face Wash 100ml', 'Himalaya', 'Personal care', 'Nova Traders', '100 ml', 185, 176, 140, 5, 0, 0, 12, 275, 74],
  ['8901000050051', 'Hair Oil 200ml', 'Parachute', 'Personal care', 'Nova Traders', '200 ml', 145, 138, 110, 31, 0, 1, 15, 330, 2],
  ['8901000060012', 'Tea Powder 500g', 'Red Label', 'Beverages', 'Gujarat Foods', '500 g', 265, 252, 201, 42, 0, 0, 18, 290, 1],
  ['8901000060029', 'Instant Coffee 100g', 'Nescafé', 'Beverages', 'Gujarat Foods', '100 g', 340, 325, 262, 3, 0, 0, 10, 240, 5],
  ['8901000060036', 'Mango Drink 1L', 'Frooti', 'Beverages', 'Gujarat Foods', '1 L', 95, 90, 71, 128, 4, 2, 40, 26, 0],
  ['8901000060043', 'Soda Water 750ml', 'Bisleri', 'Beverages', 'Gujarat Foods', '750 ml', 45, 42, 32, 96, 0, 0, 36, 18, 3],
  ['8901000060050', 'Energy Drink 250ml', 'Sting', 'Beverages', 'Nova Traders', '250 ml', 35, 33, 25, 12, 0, 0, 30, 64, 61],
];

export const STATUS_META = {
  healthy: { label: 'Healthy', tone: 'success', icon: 'bi-check-circle' },
  low: { label: 'Low stock', tone: 'warning', icon: 'bi-arrow-down-circle', critical: true },
  expiring: { label: 'Near expiry', tone: 'danger', icon: 'bi-clock-history', critical: true },
  dead: { label: 'Dead stock', tone: 'muted', icon: 'bi-box2-heart' },
};

// Highest-priority signal wins: something expiring needs attention before
// something merely low, and dead stock only matters once neither applies.
export function statusOf(product) {
  if (product.expiryInDays <= 30) return 'expiring';
  if (product.available <= product.minStock) return 'low';
  if (product.daysSinceSold >= 60) return 'dead';
  return 'healthy';
}

function toDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
}

export const PRODUCTS = RAW.map((row, index) => {
  const [barcode, name, brand, category, supplier, unit, mrp, price, cost,
    available, reserved, damaged, minStock, expiryInDays, daysSinceSold] = row;
  const product = {
    id: index + 1, barcode, name, brand, category, supplier, unit,
    mrp, price, cost, available, reserved, damaged, minStock,
    expiryInDays, daysSinceSold,
    expiryDate: toDate(expiryInDays),
    value: available * cost,
  };
  return { ...product, status: statusOf(product) };
});

export const countByStatus = (products) => products.reduce((counts, product) => (
  { ...counts, [product.status]: (counts[product.status] || 0) + 1 }
), {});

// The hero's health score, derived from the mix rather than hardcoded, so it
// stays honest if the placeholder rows are edited.
export function inventoryIntelligence(products) {
  const counts = countByStatus(products);
  const healthy = counts.healthy || 0;
  const low = counts.low || 0;
  const expiring = counts.expiring || 0;
  const dead = counts.dead || 0;
  const urgent = products.filter((p) => p.expiryInDays <= 3);
  const avoidableLoss = Math.round(
    products.filter((p) => p.status === 'expiring').reduce((sum, p) => sum + p.available * p.cost * 0.45, 0),
  );
  const deadValue = products.filter((p) => p.status === 'dead').reduce((sum, p) => sum + p.value, 0);
  const score = Math.max(0, Math.min(100, Math.round(
    100 - (low * 2.4) - (expiring * 3.1) - (dead * 1.8),
  )));

  return {
    score,
    status: score >= 85 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'Needs attention' : 'At risk',
    tone: score >= 85 ? 'success' : score >= 70 ? 'olive' : score >= 50 ? 'warning' : 'danger',
    totalValue: products.reduce((sum, p) => sum + p.value, 0),
    deadValue,
    lines: [
      { id: 'healthy', filter: 'healthy', icon: 'bi-check-lg', text: `${healthy} products are healthy.` },
      { id: 'low', filter: 'low', icon: 'bi-check-lg', text: `${low} products require restocking.` },
      { id: 'expiring', filter: 'expiring', icon: 'bi-check-lg', text: `${urgent.length} products expire within 3 days.` },
      { id: 'loss', filter: 'expiring', icon: 'bi-check-lg', text: `Estimated avoidable loss: ₹${avoidableLoss.toLocaleString('en-IN')}.` },
    ],
  };
}

export const RECOMMENDATIONS = [
  {
    id: 'reorder', priority: 'High', confidence: 98, tone: 'gold', icon: 'bi-arrow-repeat',
    title: 'Reorder 24 units of Amul Butter 500g',
    reason: 'Forecast demand of 41 units against 18 on hand, with a 3-day supplier lead time.',
    impact: 'Avoids a stockout on a top-ten revenue product.',
  },
  {
    id: 'discount', priority: 'Medium', confidence: 91, tone: 'warning', icon: 'bi-tag',
    title: 'Discount Fresh Cream 250ml by 12%',
    reason: '34 units expire in 2 days at a sell-through rate that will not clear them.',
    impact: 'Protects roughly ₹1,100 against a full write-off.',
  },
  {
    id: 'dead', priority: 'Low', confidence: 89, tone: 'danger', icon: 'bi-box2-heart',
    title: 'Clear or return 6 dormant products',
    reason: 'No recorded sale in 60+ days while comparable products kept moving.',
    impact: 'Frees working capital currently sitting on the shelf.',
  },
];

// Placeholder movement history for the drawer.
export const HISTORY = [
  { id: 1, icon: 'bi-cart-check', tone: 'success', title: 'Sold 12 units', detail: 'Across 9 invoices', when: 'Today' },
  { id: 2, icon: 'bi-truck', tone: 'olive', title: 'Received 48 units', detail: 'PUR-1042 · Sharma Distributors', when: '2 days ago' },
  { id: 3, icon: 'bi-exclamation-triangle', tone: 'warning', title: 'Fell below minimum stock', detail: 'Threshold crossed at 18 units', when: '3 days ago' },
  { id: 4, icon: 'bi-arrow-repeat', tone: 'muted', title: 'Synchronized from CSV', detail: 'SYN-1039 · 431 rows accepted', when: '4 days ago' },
];

export const COLUMNS = [
  { id: 'name', label: 'Product', always: true },
  { id: 'category', label: 'Category' },
  { id: 'supplier', label: 'Supplier' },
  { id: 'available', label: 'Stock' },
  { id: 'value', label: 'Value' },
  { id: 'expiry', label: 'Expiry' },
  { id: 'status', label: 'Status', always: true },
];
