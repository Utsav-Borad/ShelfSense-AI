// Placeholder data for the Decision Center. Realistic figures for a mid-sized
// Indian grocery shop — nothing here comes from an API.

export const HEALTH = {
  score: 92,
  status: 'Excellent',
  trend: 'up',
  delta: 4,
  since: 'since last week',
  factors: [
    ['Stock cover', 96],
    ['Margin held', 91],
    ['Expiry exposure', 84],
    ['Supplier reliability', 94],
  ],
};

// The AI brief, revealed a line at a time.
export const BRIEF_LINES = [
  'Reading yesterday’s synchronization — 412 rows across three reports.',
  'Revenue is up 14.2% week on week, carried by dairy and bakery.',
  '12 items reach expiry within 30 days; ₹6,150 is exposed.',
  'Four products will run out before Thursday at current velocity.',
  'One decision needs you today: reorder Amul Butter 500g.',
];

export const KPIS = [
  { id: 'revenue', label: 'Revenue', icon: 'bi-currency-rupee', value: 18240, prefix: '₹', delta: 14.2, tone: 'gold', note: 'this week', spark: [9, 11, 10, 13, 12, 16, 18] },
  { id: 'profit', label: 'Profit estimate', icon: 'bi-graph-up-arrow', value: 4380, prefix: '₹', delta: 9.4, tone: 'olive', note: 'after cost and discount', spark: [3, 3.4, 3.1, 3.8, 3.6, 4.1, 4.4] },
  { id: 'inventory', label: 'Inventory value', icon: 'bi-boxes', value: 216500, prefix: '₹', delta: -2.1, tone: 'sage', note: 'capital on the shelf', spark: [232, 229, 226, 224, 221, 218, 216] },
  { id: 'products', label: 'Products', icon: 'bi-tags', value: 418, delta: 1.2, tone: 'soft', note: 'active in catalog', spark: [402, 405, 407, 410, 412, 416, 418] },
  { id: 'low', label: 'Low stock', icon: 'bi-exclamation-triangle', value: 14, delta: 5, tone: 'warning', note: 'below your threshold', invertDelta: true, spark: [8, 9, 11, 10, 12, 13, 14] },
  { id: 'expiry', label: 'Near expiry', icon: 'bi-clock-history', value: 12, delta: -3, tone: 'danger', note: 'within 30 days', invertDelta: true, spark: [18, 17, 16, 15, 14, 13, 12] },
];

export const SALES_TREND = { values: [128, 142, 136, 168, 154, 192, 210], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] };
export const REVENUE_BARS = { values: [2.1, 2.4, 2.2, 2.9, 2.6, 3.4, 3.8], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] };
export const INVENTORY_AREA = { values: [232, 229, 226, 224, 221, 218, 216, 214], compare: [210, 212, 214, 213, 215, 214, 216, 218], labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'] };
export const DEMAND_SPLIT = [
  { label: 'Dairy', value: 34, tone: 'gold' },
  { label: 'Bakery', value: 26, tone: 'olive' },
  { label: 'Packaged', value: 22, tone: 'sage' },
  { label: 'Household', value: 18, tone: 'soft' },
];

export const INVENTORY_HEALTH = [
  { label: 'Healthy stock', value: 68, count: 284, tone: 'success' },
  { label: 'Slow moving', value: 16, count: 67, tone: 'warning' },
  { label: 'Near expiry', value: 9, count: 38, tone: 'danger' },
  { label: 'Dead stock', value: 7, count: 29, tone: 'muted' },
];

export const TOP_PRODUCTS = [
  { name: 'Amul Butter 500g', category: 'Dairy', revenue: 4280, units: 96, trend: 18 },
  { name: 'Britannia Brown Bread', category: 'Bakery', revenue: 3140, units: 142, trend: 11 },
  { name: 'Toned Milk 1L', category: 'Dairy', revenue: 2960, units: 218, trend: 7 },
  { name: 'Basmati Rice 5kg', category: 'Packaged', revenue: 2410, units: 34, trend: -4 },
  { name: 'Detergent Powder 1kg', category: 'Household', revenue: 1870, units: 51, trend: 3 },
];

export const RECOMMENDATIONS = [
  {
    id: 'reorder', priority: 'High', confidence: 98, tone: 'gold', icon: 'bi-arrow-repeat',
    title: 'Reorder 24 units of Amul Butter 500g',
    reason: 'Forecast demand of 41 units against 18 on hand, with a 3-day supplier lead time.',
    impact: 'Avoids a stockout on a top-ten revenue product.',
    action: 'Raise a purchase order with Sharma Distributors before Thursday.',
  },
  {
    id: 'discount', priority: 'Medium', confidence: 91, tone: 'warning', icon: 'bi-tag',
    title: 'Apply 12% on Fresh Cream 250ml for 6 days',
    reason: 'Sell-through must rise 2.1x to clear before expiry; historical elasticity clears it at 12%.',
    impact: 'Protects ₹3,400 of margin against a ₹5,900 write-off.',
    action: 'Mark down the batch expiring 18 Aug.',
  },
  {
    id: 'dead', priority: 'Low', confidence: 89, tone: 'danger', icon: 'bi-box2-heart',
    title: 'Review 7 products holding ₹42,800',
    reason: 'No recorded sale in 63 days while comparable products kept moving.',
    impact: 'Recoverable through clearance or return-to-supplier.',
    action: 'Decide clearance or return before the next purchase cycle.',
  },
];

export const ACTIVITY = [
  { id: 1, icon: 'bi-cloud-check', tone: 'success', title: 'Synchronization completed', detail: '412 of 412 rows accepted', time: '09:12' },
  { id: 2, icon: 'bi-cpu', tone: 'gold', title: 'AI recommendations refreshed', detail: 'Six models re-run on the new position', time: '09:12' },
  { id: 3, icon: 'bi-exclamation-triangle', tone: 'warning', title: 'Low stock threshold crossed', detail: 'Amul Butter 500g fell to 18 units', time: '08:47' },
  { id: 4, icon: 'bi-envelope-check', tone: 'muted', title: 'Daily report emailed', detail: 'Sent to owner@shelfsense.ai', time: '08:00' },
  { id: 5, icon: 'bi-clock-history', tone: 'danger', title: 'Near-expiry batch flagged', detail: 'Fresh Cream 250ml · expires 18 Aug', time: 'Yesterday' },
  { id: 6, icon: 'bi-truck', tone: 'success', title: 'Supplier scored', detail: 'Sharma Distributors rated A+ (92/100)', time: 'Yesterday' },
];

export const QUICK_ACTIONS = [
  { label: 'Upload CSV', icon: 'bi-cloud-arrow-up', to: '/csv-upload', hint: 'Sync today’s exports' },
  { label: 'View inventory', icon: 'bi-boxes', to: '/inventory', hint: 'Stock and expiry' },
  { label: 'AI insights', icon: 'bi-stars', to: '/ai-insights', hint: 'All recommendations' },
  { label: 'Reports', icon: 'bi-file-earmark-bar-graph', to: '/reports', hint: 'Export and share' },
];
