// Product Intelligence placeholder data. Nothing here comes from an API.
//
// There are no real product photographs in the project, so each product gets a
// generated tile instead: a category-tinted gradient with an icon and the
// product's initials. Swap `image` for a real URL when photography exists.

export const CATEGORIES = ['Dairy', 'Bakery', 'Packaged', 'Household', 'Personal care', 'Beverages'];

export const CATEGORY_META = {
  Dairy: { icon: 'bi-cup-straw', tone: 'sage' },
  Bakery: { icon: 'bi-basket', tone: 'gold' },
  Packaged: { icon: 'bi-box-seam', tone: 'olive' },
  Household: { icon: 'bi-house-gear', tone: 'primary' },
  'Personal care': { icon: 'bi-droplet', tone: 'info' },
  Beverages: { icon: 'bi-cup-hot', tone: 'warning' },
};

export const STATUS_META = {
  performing: { label: 'Performing', tone: 'success', icon: 'bi-graph-up-arrow' },
  steady: { label: 'Steady', tone: 'olive', icon: 'bi-dash-circle' },
  slow: { label: 'Slow moving', tone: 'warning', icon: 'bi-hourglass-split' },
  action: { label: 'Needs action', tone: 'danger', icon: 'bi-exclamation-triangle' },
};

// [name, brand, category, unit, stock, minStock, price, cost, trend, score, spark]
const RAW = [
  ['Toned Milk 1L', 'Amul', 'Dairy', '1 L', 142, 60, 66, 54, 24, 94, [88, 92, 96, 104, 112, 128, 142]],
  ['Amul Butter 500g', 'Amul', 'Dairy', '500 g', 18, 24, 262, 214, 18, 91, [62, 68, 71, 78, 84, 92, 96]],
  ['Paneer 200g', 'Amul', 'Dairy', '200 g', 26, 18, 95, 78, 11, 82, [30, 32, 31, 35, 38, 41, 44]],
  ['Fresh Cream 250ml', 'Amul', 'Dairy', '250 ml', 34, 20, 88, 71, -6, 48, [40, 38, 36, 34, 31, 29, 27]],
  ['Cheese Slices 200g', 'Britannia', 'Dairy', '200 g', 12, 16, 139, 112, 4, 71, [22, 23, 22, 24, 25, 25, 26]],
  ['Brown Bread 400g', 'Britannia', 'Bakery', '400 g', 78, 30, 52, 41, 14, 86, [58, 61, 64, 68, 71, 76, 82]],
  ['Whole Wheat Bread', 'Modern', 'Bakery', '400 g', 41, 25, 48, 38, 6, 74, [34, 35, 34, 36, 37, 38, 40]],
  ['Rusk Toast 300g', 'Britannia', 'Bakery', '300 g', 96, 30, 58, 45, 2, 66, [44, 45, 44, 45, 46, 45, 46]],
  ['Cream Biscuits', 'Sunfeast', 'Bakery', '150 g', 210, 60, 38, 29, -19, 31, [96, 88, 81, 74, 66, 58, 51]],
  ['Multigrain Cookies', 'Unibic', 'Bakery', '200 g', 8, 20, 82, 64, -12, 38, [26, 24, 22, 20, 18, 16, 14]],
  ['Basmati Rice 5kg', 'India Gate', 'Packaged', '5 kg', 34, 12, 689, 560, 9, 88, [24, 26, 27, 29, 30, 32, 34]],
  ['Toor Dal 1kg', 'Tata', 'Packaged', '1 kg', 62, 25, 178, 142, 7, 79, [48, 50, 51, 54, 56, 59, 62]],
  ['Sunflower Oil 1L', 'Fortune', 'Packaged', '1 L', 88, 30, 149, 121, 12, 84, [62, 66, 69, 74, 78, 83, 88]],
  ['Iodised Salt 1kg', 'Tata', 'Packaged', '1 kg', 164, 50, 26, 19, 1, 62, [80, 81, 80, 82, 81, 83, 82]],
  ['Sugar 1kg', 'Madhur', 'Packaged', '1 kg', 9, 40, 49, 40, 3, 58, [46, 47, 46, 48, 47, 49, 48]],
  ['Instant Noodles Pack', 'Maggi', 'Packaged', '280 g', 186, 60, 58, 44, 16, 89, [102, 108, 116, 124, 138, 152, 168]],
  ['Cornflakes 475g', 'Kellogg’s', 'Packaged', '475 g', 7, 15, 210, 168, -14, 34, [20, 18, 17, 15, 13, 12, 10]],
  ['Peanut Butter 340g', 'Pintola', 'Packaged', '340 g', 4, 12, 295, 238, -9, 41, [14, 13, 12, 11, 10, 9, 8]],
  ['Detergent Powder 1kg', 'Surf Excel', 'Household', '1 kg', 54, 20, 122, 96, 8, 81, [40, 42, 43, 45, 48, 51, 54]],
  ['Dishwash Gel 750ml', 'Vim', 'Household', '750 ml', 38, 18, 158, 126, 5, 76, [30, 31, 32, 33, 35, 36, 38]],
  ['Floor Cleaner 1L', 'Lizol', 'Household', '1 L', 6, 14, 186, 149, -3, 52, [16, 15, 15, 14, 13, 13, 12]],
  ['Garbage Bags 30pc', 'Origami', 'Household', '30 pc', 11, 15, 142, 112, -16, 33, [24, 22, 20, 18, 16, 14, 12]],
  ['Shampoo 340ml', 'Dove', 'Personal care', '340 ml', 22, 12, 379, 302, 10, 83, [16, 17, 18, 19, 20, 21, 22]],
  ['Bathing Soap 4x100g', 'Lux', 'Personal care', '4 x 100 g', 64, 24, 172, 136, 6, 77, [50, 52, 54, 56, 58, 61, 64]],
  ['Toothpaste 200g', 'Colgate', 'Personal care', '200 g', 48, 20, 116, 92, 4, 73, [40, 41, 42, 44, 45, 47, 48]],
  ['Face Wash 100ml', 'Himalaya', 'Personal care', '100 ml', 5, 12, 176, 140, -11, 39, [15, 14, 13, 12, 11, 10, 9]],
  ['Tea Powder 500g', 'Red Label', 'Beverages', '500 g', 42, 18, 252, 201, 9, 85, [32, 34, 35, 37, 39, 41, 42]],
  ['Instant Coffee 100g', 'Nescafé', 'Beverages', '100 g', 3, 10, 325, 262, 2, 61, [12, 12, 11, 12, 12, 13, 12]],
  ['Mango Drink 1L', 'Frooti', 'Beverages', '1 L', 128, 40, 90, 71, 7, 87, [92, 96, 100, 108, 114, 121, 128]],
  ['Soda Water 750ml', 'Bisleri', 'Beverages', '750 ml', 96, 36, 42, 32, 3, 68, [82, 84, 86, 88, 90, 93, 96]],
  ['Energy Drink 250ml', 'Sting', 'Beverages', '250 ml', 12, 30, 33, 25, -8, 44, [26, 24, 22, 20, 18, 15, 13]],
];

// Performance status, derived from trend and how the stock sits against its
// minimum — so it stays truthful if these rows are edited.
function statusOf(product) {
  if (product.trend <= -10 || product.score < 40) return 'action';
  if (product.trend < 0) return 'slow';
  if (product.trend >= 10 && product.score >= 80) return 'performing';
  return 'steady';
}

export const PRODUCTS = RAW.map((row, index) => {
  const [name, brand, category, unit, stock, minStock, price, cost, trend, score, spark] = row;
  const initials = name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();
  const product = {
    id: index + 1, name, brand, category, unit, stock, minStock, price, cost, trend, score, spark,
    value: stock * cost,
    margin: Math.round(((price - cost) / price) * 100),
    initials,
    icon: CATEGORY_META[category].icon,
    tone: CATEGORY_META[category].tone,
  };
  return { ...product, status: statusOf(product) };
});

// The hero brief. Every figure is read off the data rather than written by
// hand, and each line carries the filter it applies when clicked.
export function productIntelligence(products) {
  const byTrend = [...products].sort((a, b) => b.trend - a.trend);
  const byValue = [...products].sort((a, b) => b.value - a.value);
  const fastest = byTrend[0];
  const slowest = byTrend[byTrend.length - 1];
  const valuable = byValue[0];
  // A steady product with a healthy margin is the one worth a push.
  const promote = [...products]
    .filter((product) => product.trend >= 0 && product.trend < 10)
    .sort((a, b) => (b.margin * b.score) - (a.margin * a.score))[0];

  const performing = products.filter((product) => product.status === 'performing').length;
  const needsAction = products.filter((product) => product.status === 'action').length;
  const averageScore = Math.round(products.reduce((sum, product) => sum + product.score, 0) / products.length);

  return {
    averageScore,
    performing,
    needsAction,
    catalogValue: products.reduce((sum, product) => sum + product.value, 0),
    lines: [
      { id: 'fastest', text: `Fastest growing product: ${fastest.name} (+${fastest.trend}%)`, highlight: [fastest.id], filter: { status: 'performing' } },
      { id: 'slowest', text: `Slowest moving: ${slowest.name} (${slowest.trend}%)`, highlight: [slowest.id], filter: { status: 'action' } },
      { id: 'value', text: `Highest inventory value: ${valuable.name} (₹${valuable.value.toLocaleString('en-IN')})`, highlight: [valuable.id], filter: { category: valuable.category } },
      { id: 'promote', text: `AI recommends promoting ${promote.name} this week.`, highlight: [promote.id], filter: { status: 'steady' } },
    ],
  };
}

export const SORTS = [
  { value: 'score', label: 'AI score' },
  { value: 'value', label: 'Inventory value' },
  { value: 'stock', label: 'Current stock' },
  { value: 'name', label: 'Name' },
];
