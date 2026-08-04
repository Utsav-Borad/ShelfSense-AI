// AI Decision Center placeholder data. No model is consulted anywhere.

export const PRIORITY_META = {
  critical: { label: 'Critical', tone: 'danger', dot: '🔴', icon: 'bi-exclamation-octagon' },
  high: { label: 'High', tone: 'warning', dot: '🟠', icon: 'bi-exclamation-triangle' },
  medium: { label: 'Medium', tone: 'gold', dot: '🟡', icon: 'bi-info-circle' },
  low: { label: 'Low', tone: 'olive', dot: '🟢', icon: 'bi-check-circle' },
};

// The five decisions that make up today's plan, ordered by what deserves
// attention first.
export const RECOMMENDATIONS = [
  {
    id: 'reorder-milk', priority: 'critical', icon: 'bi-arrow-repeat', category: 'Reorder',
    title: 'Reorder Toned Milk 1L',
    short: 'Reorder Milk',
    reason: 'Forecast demand of 168 units against 42 on hand. At current velocity you run out in 3 days, and your supplier needs 3 days to deliver.',
    impact: 'Protects an estimated ₹18,500 of revenue over the next fortnight, plus the attached basket that dairy pulls with it.',
    impactValue: 18500,
    impactLabel: 'revenue protected',
    confidence: 98,
    timeline: 'Today — before 6pm',
    urgency: 'Potential stockout in 3 days.',
    conversation: {
      happened: 'Toned Milk 1L is down to 42 units. It sold 168 units over the equivalent period last week and demand is still climbing.',
      why: 'Weekend demand grew 31% while your delivery schedule stayed on Monday. The buffer that used to absorb that growth no longer covers it.',
      next: 'Raise a purchase order with Amul Depot today. 180 units covers the forecast with a two-day safety margin at their 1.6-day average lead time.',
      impact: 'Avoiding the stockout protects roughly ₹18,500 directly. Dairy customers buy 3.2 other items per visit, so the indirect figure is materially larger.',
    },
  },
  {
    id: 'discount-drinks', priority: 'high', icon: 'bi-tag', category: 'Pricing',
    title: 'Discount soft drinks by 15%',
    short: 'Discount Soft Drinks',
    reason: '96 units of Soda Water and 128 of Mango Drink have not moved in 34 days, and both batches reach expiry inside 26 days.',
    impact: 'Recovers an estimated ₹6,800 of capital that is otherwise heading for a write-off.',
    impactValue: 6800,
    impactLabel: 'recoverable value',
    confidence: 91,
    timeline: 'Within 6 days',
    urgency: 'Dead stock detected.',
    conversation: {
      happened: 'Two beverage lines have stopped moving. Together they hold ₹9,200 of stock, and both reach expiry within 26 days.',
      why: 'Beverage demand fell as the season turned, but the purchase quantities were set on summer velocity. The stock is not defective — it is simply mispriced for the current season.',
      next: 'Apply 15% for six days and place both lines at eye level. Historical elasticity on beverages clears this volume at that discount.',
      impact: 'Recovers around ₹6,800 against a full write-off of ₹9,200. Acting later means a deeper discount for less return.',
    },
  },
  {
    id: 'increase-dairy', priority: 'medium', icon: 'bi-graph-up-arrow', category: 'Purchasing',
    title: 'Increase dairy orders by 18%',
    short: 'Increase Dairy Orders',
    reason: 'Dairy demand has risen 18% across three consecutive weeks, and the trend has not flattened. Your order quantities have not moved.',
    impact: 'Captures an estimated ₹9,400 of demand you are currently turning away through thin shelves.',
    impactValue: 9400,
    impactLabel: 'demand captured',
    confidence: 96,
    timeline: 'Next purchase cycle',
    urgency: 'Demand forecast is rising by 18%.',
    conversation: {
      happened: 'Dairy is now 34% of revenue, up from 27%. Growth has held for three consecutive weeks with no sign of flattening.',
      why: 'Dairy is a weekly repeat purchase and your availability has been good, so customers have settled into a habit. The category is compounding rather than spiking.',
      next: 'Raise standing dairy quantities by 18% from the next cycle. Amul Depot scores 97 on reliability, so the supply side can absorb it.',
      impact: 'Roughly ₹9,400 of currently unmet demand, at a category margin of 24%.',
    },
  },
  {
    id: 'clear-dormant', priority: 'medium', icon: 'bi-box2-heart', category: 'Capital',
    title: 'Clear or return 7 dormant products',
    short: 'Clear Dormant Stock',
    reason: 'Seven products have recorded no sale in 63 days while comparable lines in the same categories kept moving.',
    impact: 'Frees an estimated ₹42,800 of working capital sitting idle on the shelf.',
    impactValue: 42800,
    impactLabel: 'capital freed',
    confidence: 89,
    timeline: 'Before the next purchase cycle',
    urgency: '₹42,800 held in dormant stock.',
    conversation: {
      happened: 'Seven products classified as dead stock. They hold ₹42,800 and have produced no revenue in over two months.',
      why: 'These are not seasonal — comparable products in the same categories sold normally over the same window. They were over-ordered once and never corrected.',
      next: 'Decide clearance or return-to-supplier before the next cycle, while the capital is still recoverable. Do not restock any of them afterwards.',
      impact: 'Clearance at typical rates returns around ₹29,000. Returning under supplier terms recovers more where it is available.',
    },
  },
  {
    id: 'switch-supplier', priority: 'low', icon: 'bi-truck', category: 'Suppliers',
    title: 'Move two lines to Gujarat Foods',
    short: 'Rebalance Suppliers',
    reason: 'Krishna Beverages and Shakti Wholesale account for 6 of your 9 late deliveries. Gujarat Foods already covers both categories at a 94 reliability score.',
    impact: 'Reduces expected delivery delay by 2.4 days on the affected lines, cutting stockout days by around 4%.',
    impactValue: 3200,
    impactLabel: 'stockouts avoided',
    confidence: 87,
    timeline: 'This month',
    urgency: 'Two suppliers are dragging reliability down.',
    conversation: {
      happened: 'Your two weakest suppliers score 73 and 79, against 94 for the rest. They account for two thirds of all late deliveries.',
      why: 'Both are single-category specialists with longer lead times. They are competitive on price but inconsistent on timing, and that inconsistency surfaces as stockouts three days later.',
      next: 'Move the two most stockout-prone lines to Gujarat Foods and keep the rest where they are. No renegotiation needed — they already supply you.',
      impact: 'Around 2.4 days less delay on those lines, worth an estimated ₹3,200 in avoided stockouts per month.',
    },
  },
];

// The three the Copilot previews in its morning briefing.
export const COPILOT_HIGHLIGHTS = ['reorder-milk', 'discount-drinks', 'increase-dairy'];

export const OPPORTUNITY_SCORE = 91;
export const ESTIMATED_IMPROVEMENT = 28450;

export const OPPORTUNITIES = [
  { id: 'o1', icon: 'bi-basket', title: 'Bundle bread with dairy', detail: 'Customers buying milk purchase bread 41% of the time. A bundle lifts attach rate.', value: 4200, confidence: 84 },
  { id: 'o2', icon: 'bi-clock', title: 'Extend Saturday hours by one hour', detail: 'Saturday now carries 36% of weekly units and is still rising at close.', value: 5600, confidence: 78 },
  { id: 'o3', icon: 'bi-tags', title: 'Introduce a second bakery brand', detail: 'Bakery sells out twice weekly with only one supplier covering it.', value: 3800, confidence: 81 },
];

export const RISKS = [
  { id: 'r1', tone: 'danger', icon: 'bi-clock-history', title: '12 items expire within 30 days', detail: '₹6,150 exposed. Nine days remain to act at a shallow discount.', severity: 'High' },
  { id: 'r2', tone: 'warning', icon: 'bi-arrow-down-circle', title: '14 products below minimum stock', detail: 'Four will run out before Thursday at current velocity.', severity: 'Medium' },
  { id: 'r3', tone: 'warning', icon: 'bi-truck', title: 'Supplier reliability slipping', detail: 'Two suppliers have delayed 6 deliveries between them this month.', severity: 'Medium' },
];

export const HISTORY = [
  { id: 'h1', decision: 'Reorder Amul Butter 500g', outcome: 'accepted', result: 'Stockout avoided · ₹4,280 protected', when: 'Yesterday' },
  { id: 'h2', decision: 'Discount Fresh Cream 250ml', outcome: 'accepted', result: 'Cleared 31 of 34 units · ₹3,400 recovered', when: '3 days ago' },
  { id: 'h3', decision: 'Add third packaged-goods supplier', outcome: 'dismissed', result: 'Owner preferred existing terms', when: '5 days ago' },
  { id: 'h4', decision: 'Clear 6 dormant household lines', outcome: 'accepted', result: '₹11,900 of capital recovered', when: '1 week ago' },
  { id: 'h5', decision: 'Raise minimum stock on bakery', outcome: 'accepted', result: 'Weekend stockouts down from 4 to 1', when: '2 weeks ago' },
];

export const getRecommendation = (id) => RECOMMENDATIONS.find((item) => item.id === id);

export function greetingFor(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
