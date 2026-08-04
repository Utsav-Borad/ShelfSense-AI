// Business Analytics placeholder data. Nothing here comes from an API.
//
// Every chart carries its own AI explanation — the point of this page is the
// story behind the number, not the number.

export const RANGES = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
  { id: 'year', label: 'Year' },
  { id: 'custom', label: 'Custom' },
];

export const LABELS = {
  today: ['9a', '11a', '1p', '3p', '5p', '7p', '9p'],
  week: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  month: ['W1', 'W2', 'W3', 'W4'],
  year: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  custom: ['1–7', '8–14', '15–21', '22–28', '29–31'],
};

// Per range: the series each chart draws.
export const SERIES = {
  today: {
    revenue: [1.2, 2.1, 3.4, 2.8, 3.9, 4.6, 3.1], sales: [14, 26, 38, 31, 44, 52, 35],
    turnover: [3.6, 3.7, 3.8, 3.8, 3.9, 4.0, 4.1], turnoverCompare: [3.4, 3.4, 3.5, 3.5, 3.6, 3.6, 3.7],
    deadStock: [29, 29, 29, 28, 28, 28, 28], nearExpiry: [12, 12, 11, 11, 11, 10, 10],
    forecast: [14, 26, 38, 31, 44, 52, 35], forecastCompare: [16, 24, 36, 34, 42, 49, 38],
  },
  week: {
    revenue: [2.1, 2.4, 2.2, 2.9, 2.6, 3.4, 3.8], sales: [128, 142, 136, 168, 154, 192, 210],
    turnover: [3.2, 3.4, 3.5, 3.6, 3.8, 3.9, 4.1], turnoverCompare: [3.0, 3.1, 3.2, 3.2, 3.4, 3.5, 3.6],
    deadStock: [34, 33, 33, 31, 30, 30, 29], nearExpiry: [18, 17, 16, 15, 14, 13, 12],
    forecast: [128, 142, 136, 168, 154, 192, 210], forecastCompare: [132, 138, 141, 162, 159, 186, 204],
  },
  month: {
    revenue: [14.2, 16.8, 15.4, 18.2], sales: [812, 946, 878, 1024],
    turnover: [3.1, 3.4, 3.7, 4.1], turnoverCompare: [2.9, 3.0, 3.2, 3.4],
    deadStock: [42, 38, 33, 29], nearExpiry: [26, 22, 17, 12],
    forecast: [812, 946, 878, 1024], forecastCompare: [830, 921, 894, 998],
  },
  year: {
    revenue: [11.4, 12.1, 13.6, 12.8, 14.2, 15.1, 14.6, 16.2, 15.8, 17.1, 16.4, 18.2],
    sales: [642, 688, 741, 706, 792, 836, 804, 902, 878, 946, 918, 1024],
    turnover: [2.4, 2.5, 2.7, 2.6, 2.9, 3.0, 3.1, 3.3, 3.4, 3.6, 3.8, 4.1],
    turnoverCompare: [2.2, 2.3, 2.4, 2.4, 2.6, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.4],
    deadStock: [61, 58, 54, 56, 51, 48, 46, 44, 41, 38, 33, 29],
    nearExpiry: [38, 36, 34, 35, 31, 29, 28, 26, 24, 22, 17, 12],
    forecast: [642, 688, 741, 706, 792, 836, 804, 902, 878, 946, 918, 1024],
    forecastCompare: [658, 674, 728, 719, 781, 822, 819, 886, 891, 932, 934, 1006],
  },
  custom: {
    revenue: [4.1, 4.6, 4.2, 5.1, 2.4], sales: [238, 264, 246, 292, 138],
    turnover: [3.3, 3.5, 3.7, 3.9, 4.1], turnoverCompare: [3.1, 3.2, 3.3, 3.4, 3.5],
    deadStock: [38, 35, 33, 31, 29], nearExpiry: [22, 19, 17, 14, 12],
    forecast: [238, 264, 246, 292, 138], forecastCompare: [244, 258, 251, 284, 146],
  },
};

// Categories and suppliers do not change shape by range, only by weight.
export const CATEGORY_SPLIT = [
  { label: 'Dairy', value: 34, tone: 'gold' },
  { label: 'Bakery', value: 26, tone: 'olive' },
  { label: 'Packaged', value: 22, tone: 'sage' },
  { label: 'Household', value: 18, tone: 'soft' },
];

export const SUPPLIER_SCORES = {
  values: [97, 94, 92, 91, 88, 85, 79, 73],
  labels: ['Amul', 'Sharma', 'Sunrise', 'Gujarat', 'Meera', 'Patel', 'Shakti', 'Krishna'],
};

// Headline figures per range, so the KPI on each panel moves with the selector.
export const HEADLINES = {
  today: { revenue: '₹4.6k', sales: '240', turnover: '4.1x', dead: '28', expiry: '10', forecast: '94%' },
  week: { revenue: '₹18.2k', sales: '1,130', turnover: '4.1x', dead: '29', expiry: '12', forecast: '94%' },
  month: { revenue: '₹64.6k', sales: '3,660', turnover: '4.1x', dead: '29', expiry: '12', forecast: '92%' },
  year: { revenue: '₹177.5k', sales: '9,857', turnover: '4.1x', dead: '29', expiry: '12', forecast: '89%' },
  custom: { revenue: '₹20.4k', sales: '1,178', turnover: '4.1x', dead: '29', expiry: '12', forecast: '93%' },
};

// One entry per chart. `explain` is the hover card; `conversation` is the
// drawer. Both are placeholder text — no model is involved.
export const CHARTS = [
  {
    id: 'revenue', order: 0, kind: 'line', title: 'Revenue trend', caption: 'Revenue',
    metric: 'revenue', delta: 18, tone: 'gold',
    explain: {
      summary: 'Revenue is up 18% across the period, and the rise is accelerating rather than flattening.',
      reason: 'Dairy and bakery moved 22% more units after stock stayed continuously available — the weeks with no stockouts are the weeks revenue climbed.',
      action: 'Protect availability on the top ten products before widening the range.',
      confidence: 94,
    },
    conversation: {
      happened: 'Revenue rose from ₹14.2k to ₹18.2k across the period, a gain of 18%. The last two intervals contributed most of it.',
      why: 'Two things coincided. Stock cover on dairy and bakery stayed above five days for the whole period, so nothing sold out mid-week. And the discount you applied to near-expiry cream cleared stock without dropping average basket value.',
      next: 'Keep the reorder points that held availability. Do not widen the catalog yet — the gain came from selling what you already stock more consistently, not from new lines.',
      impact: 'Holding this pattern for another month projects roughly ₹21k, assuming supplier lead times stay at 3 days.',
    },
  },
  {
    id: 'sales', order: 1, kind: 'bar', title: 'Sales trend', caption: 'Units sold',
    metric: 'sales', delta: 14, tone: 'olive',
    explain: {
      summary: 'Unit sales are up 14%, with the weekend carrying an increasing share of the week.',
      reason: 'Saturday and Sunday now account for 36% of weekly units, up from 29%. Weekday volume is flat.',
      action: 'Schedule deliveries to land Thursday or Friday so shelves are full for the weekend.',
      confidence: 91,
    },
    conversation: {
      happened: 'Units sold rose 14% over the period. The growth is concentrated: weekends grew 31% while weekdays were essentially flat.',
      why: 'Your weekend footfall has grown, but weekday restocking is arriving Monday. That leaves Saturday shelves thinner than demand, which caps what the busiest days can do.',
      next: 'Move the main delivery to Thursday. It costs nothing and puts full shelves in front of your highest-traffic hours.',
      impact: 'Closing the weekend availability gap is worth an estimated 6–9% more units without any additional purchasing.',
    },
  },
  {
    id: 'turnover', order: 2, kind: 'area', title: 'Inventory turnover', caption: 'Turnover ratio',
    metric: 'turnover', compare: 'turnoverCompare', delta: 9, tone: 'olive',
    explain: {
      summary: 'Turnover improved 9% to 4.1x, meaning capital is cycling faster than last period.',
      reason: 'Slow-moving lines were cleared while fast movers stayed stocked, so the same capital did more work.',
      action: 'Hold the current reorder quantities — this is the ratio you want to defend.',
      confidence: 88,
    },
    conversation: {
      happened: 'Inventory turnover rose from 3.1x to 4.1x. The dashed line is the same period last year, which sat at 3.4x.',
      why: 'You cleared 13 slow-moving products and did not replace them, while keeping the fast movers continuously available. Less idle capital, same sales — the ratio improves by arithmetic.',
      next: 'Resist restocking the cleared lines. If a product needed a discount to move once, it will need one again.',
      impact: 'Sustaining 4.1x frees roughly ₹38k of working capital compared with the 3.1x position.',
    },
  },
  {
    id: 'category', order: 3, kind: 'donut', title: 'Category performance', caption: 'Share of revenue',
    metric: null, delta: 24, tone: 'gold',
    explain: {
      summary: 'Dairy is your fastest growing segment at 34% of revenue, up 24% on the period.',
      reason: 'Dairy has the shortest shelf life and the highest repeat rate — it brings customers back weekly, and they buy other things while they are in.',
      action: 'Treat dairy availability as the priority when purchasing budget is tight.',
      confidence: 92,
    },
    conversation: {
      happened: 'Dairy now takes 34% of revenue, ahead of bakery at 26%. Dairy grew 24% while the other three categories were broadly flat.',
      why: 'Dairy is a weekly repeat purchase. Customers who come for milk buy an average of 3.2 other items in the same visit, so dairy availability is pulling the rest of the basket with it.',
      next: 'When purchasing budget is constrained, fund dairy first. A dairy stockout costs more than the dairy margin, because it costs the attached basket too.',
      impact: 'Each dairy stockout day is estimated at ₹1,900 of lost basket, not the ₹430 of lost dairy margin.',
    },
  },
  {
    id: 'supplier', order: 4, kind: 'bar', title: 'Supplier performance', caption: 'Reliability score',
    metric: null, delta: 6, tone: 'sage',
    explain: {
      summary: 'Your top four suppliers all score above 91, but the bottom two are dragging the average down.',
      reason: 'Krishna Beverages and Shakti Wholesale account for 6 of the 9 late deliveries in the period.',
      action: 'Move the two weakest lines to Gujarat Foods, who already cover both categories.',
      confidence: 89,
    },
    conversation: {
      happened: 'Reliability ranges from 97 down to 73. The top four suppliers are stable; the bottom two account for two thirds of all late deliveries.',
      why: 'The weak suppliers are both single-category specialists with longer lead times. They are not failing on price — they are failing on consistency, which shows up as stockouts three days later.',
      next: 'Gujarat Foods already covers both of those categories at a 94 score. Move the two most stockout-prone lines across and keep the rest as-is.',
      impact: 'Expected reduction in delivery delay of about 2.4 days on the affected lines, worth roughly 4% fewer stockout days.',
    },
  },
  {
    id: 'dead', order: 5, kind: 'line', title: 'Dead stock trend', caption: 'Dormant products',
    metric: 'dead', delta: -12, tone: 'danger', invert: true,
    explain: {
      summary: 'Dead stock fell 12% to 29 products — the trend has been downward all period.',
      reason: 'Clearance pricing moved 13 dormant lines, and tighter reorder points stopped new ones forming.',
      action: 'Review the remaining 29 before the next purchase cycle rather than after it.',
      confidence: 86,
    },
    conversation: {
      happened: 'Dormant products fell from 42 to 29 across the period, a 12% reduction with no month-on-month reversal.',
      why: 'Two changes compounded. Clearance pricing cleared the existing backlog, and the tightened reorder points meant fewer products were over-ordered into dormancy in the first place.',
      next: 'The remaining 29 hold ₹42,800. Decide clearance or return-to-supplier before the next purchase cycle, while the capital is still recoverable.',
      impact: 'Clearing the remaining backlog would return an estimated ₹29k of working capital at typical clearance rates.',
    },
  },
  {
    id: 'expiry', order: 6, kind: 'bar', title: 'Near expiry analysis', caption: 'Items within 30 days',
    metric: 'expiry', delta: -33, tone: 'warning', invert: true,
    explain: {
      summary: 'Near-expiry exposure dropped by a third, from 18 items to 12.',
      reason: 'Earlier flagging gave you a longer window to discount, so more stock cleared before the date rather than after.',
      action: 'Keep the 30-day flag. Acting at 10 days is too late for slow movers.',
      confidence: 90,
    },
    conversation: {
      happened: 'Items within 30 days of expiry fell from 18 to 12, and the projected write-off value fell with them.',
      why: 'The 30-day flag gives roughly three weeks of selling time. Products flagged that early cleared at a 12% discount; products flagged at 10 days needed 30% or were written off entirely.',
      next: 'Do not shorten the flag window to reduce alert noise. The early warning is exactly what makes the cheap discount work.',
      impact: 'Current exposure is ₹6,150. Acting inside the next nine days recovers an estimated 68% of it.',
    },
  },
  {
    id: 'forecast', order: 7, kind: 'area', title: 'Demand forecast overview', caption: 'Actual vs predicted',
    metric: 'forecast', compare: 'forecastCompare', delta: 94, tone: 'gold', suffix: '% confidence',
    explain: {
      summary: 'The forecast tracked actual demand within 4% across the period, at 94% confidence.',
      reason: 'Prediction accuracy improves with synchronization frequency — you have synced daily for three weeks.',
      action: 'Keep syncing daily. Gaps in the data widen the forecast band.',
      confidence: 94,
    },
    conversation: {
      happened: 'Predicted demand tracked actual demand within 4% for the whole period. The solid line is actual, the dashed line is what the model expected.',
      why: 'The model improves with data density. Three consecutive weeks of daily synchronization gave it enough recent signal to catch the weekend shift early, which is where most of the accuracy comes from.',
      next: 'Keep synchronizing daily. Every missed day widens the confidence band on the following week, and reorder recommendations get more conservative as a result.',
      impact: 'At 94% confidence the reorder suggestions can be trusted directly. Below roughly 80%, treat them as a prompt to check rather than an instruction.',
    },
  },
];

// The hero brief. Each line points at the chart that evidences it.
export const BRIEF_LINES = [
  { id: 'b1', chart: 'revenue', text: 'Revenue increased by 18% this month.' },
  { id: 'b2', chart: 'turnover', text: 'Inventory turnover improved by 9%.' },
  { id: 'b3', chart: 'dead', text: 'Dead stock reduced by 12%.' },
  { id: 'b4', chart: 'category', text: 'Dairy category is your fastest growing segment.' },
  { id: 'b5', chart: 'forecast', text: 'Forecast confidence: 94%.' },
];

export const getChart = (id) => CHARTS.find((chart) => chart.id === id);
