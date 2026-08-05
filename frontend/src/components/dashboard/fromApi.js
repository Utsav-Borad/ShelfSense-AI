// Converts API responses into the shapes the dashboard components render.
//
// Everything here is derived from live data. Where the API genuinely has no
// source for something the original placeholder showed — week-on-week deltas,
// sparkline history, product categories, an activity log — the field is simply
// left out, and the component omits that piece rather than inventing it. The
// backend stores no history of past positions, so no trend can be computed.

const RUPEE = '₹';

function percent(part, total) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function shortDate(iso) {
  // '2025-12-31' -> '31 Dec'
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return `${date.getDate()} ${date.toLocaleString('en-IN', { month: 'short' })}`;
}

/** Overall health, derived from how many products the model flagged. */
export function toHealth(dashboard) {
  const analysed = dashboard.analysed_products || 0;
  const mix = dashboard.health_mix || {};
  const healthy = mix.HEALTHY || 0;
  const score = percent(healthy, analysed);

  let status = 'Needs attention';
  if (score >= 85) status = 'Excellent';
  else if (score >= 70) status = 'Healthy';
  else if (score >= 50) status = 'Mixed';

  return {
    score,
    status,
    factors: [
      ['Healthy products', score],
      ['Stock cover', percent(analysed - dashboard.low_stock, analysed)],
      ['Expiry safety', percent(analysed - dashboard.near_expiry - dashboard.expired, analysed)],
      ['Right-sized stock', percent(analysed - dashboard.overstock, analysed)],
    ],
  };
}

/** The AI brief, written from the real position. */
export function toBriefLines(dashboard, recommendations) {
  const lines = [
    `Analysed ${dashboard.analysed_products} of ${dashboard.products} products across ${dashboard.suppliers} suppliers.`,
    `Revenue over the last 30 days is ${RUPEE}${Math.round(dashboard.revenue_last_30_days).toLocaleString('en-IN')}.`,
    `${RUPEE}${Math.round(dashboard.stock_value).toLocaleString('en-IN')} of capital is sitting on the shelf.`,
  ];

  if (dashboard.low_stock > 0) lines.push(`${dashboard.low_stock} product(s) are below their minimum stock level.`);
  if (dashboard.near_expiry > 0) lines.push(`${dashboard.near_expiry} product(s) reach expiry within 30 days.`);
  if (dashboard.overstock > 0) lines.push(`${dashboard.overstock} product(s) are overstocked against predicted demand.`);

  const urgent = recommendations.find((item) => item.recommendation_priority === 'CRITICAL')
    || recommendations.find((item) => item.recommendation_priority === 'HIGH');
  if (urgent) lines.push(`Most urgent: ${urgent.product_name} — ${urgent.recommendation_message}`);
  else lines.push('Nothing needs a decision from you today.');

  return lines;
}

/** The KPI row. No deltas or sparklines: the API exposes only today's position. */
export function toKpis(dashboard) {
  return [
    { id: 'revenue', label: 'Revenue', icon: 'bi-currency-rupee', value: Math.round(dashboard.revenue_last_30_days), prefix: RUPEE, tone: 'gold', note: 'last 30 days' },
    { id: 'inventory', label: 'Inventory value', icon: 'bi-boxes', value: Math.round(dashboard.stock_value), prefix: RUPEE, tone: 'sage', note: 'capital on the shelf' },
    { id: 'products', label: 'Products', icon: 'bi-tags', value: dashboard.products, tone: 'soft', note: 'in your catalog' },
    { id: 'suppliers', label: 'Suppliers', icon: 'bi-truck', value: dashboard.suppliers, tone: 'olive', note: 'currently listed' },
    { id: 'low', label: 'Low stock', icon: 'bi-exclamation-triangle', value: dashboard.low_stock, tone: 'warning', note: 'below minimum level' },
    { id: 'expiry', label: 'Near expiry', icon: 'bi-clock-history', value: dashboard.near_expiry, tone: 'danger', note: 'within 30 days' },
  ];
}

/** Units sold per day, last seven days of the reporting window. */
export function toSalesTrend(trends) {
  const series = (trends.series || []).slice(-7);
  return {
    values: series.map((point) => point.units_sold),
    labels: series.map((point) => shortDate(point.date)),
  };
}

/** Revenue per day, last seven days, in thousands so the bars stay readable. */
export function toRevenueBars(revenue) {
  const series = (revenue.series || []).slice(-7);
  return {
    values: series.map((point) => Number((point.revenue / 1000).toFixed(1))),
    labels: series.map((point) => shortDate(point.date)),
  };
}

/** Share of units among the fastest-moving products. */
export function toDemandSplit(trends) {
  const movers = trends.top_movers || [];
  const total = movers.reduce((sum, item) => sum + item.units_sold, 0);
  const tones = ['gold', 'olive', 'sage', 'soft', 'warning'];
  return movers.map((item, index) => ({
    label: item.product_name,
    value: percent(item.units_sold, total),
    tone: tones[index % tones.length],
  }));
}

/** Stock position split by the status the model assigned. */
export function toInventoryHealth(inventory, dashboard) {
  const breakdown = inventory.status_breakdown || {};
  const analysed = dashboard.analysed_products || 0;
  const rows = [
    { label: 'Healthy stock', count: breakdown.HEALTHY || 0, tone: 'success' },
    { label: 'Overstocked', count: breakdown.OVERSTOCK || 0, tone: 'warning' },
    { label: 'Low stock', count: breakdown.LOW_STOCK || 0, tone: 'danger' },
    { label: 'Near expiry', count: dashboard.near_expiry || 0, tone: 'muted' },
  ];
  return rows.map((row) => ({ ...row, value: percent(row.count, analysed) }));
}

/** Best sellers for the period. The API has no category or trend for these. */
export function toTopProducts(report) {
  return (report.top_products || []).map((item) => ({
    name: item.product_name,
    revenue: Math.round(item.revenue),
    units: item.units_sold,
  }));
}

const ALERT_STYLE = {
  LOW_STOCK: { icon: 'bi-exclamation-triangle', tone: 'warning' },
  NEAR_EXPIRY: { icon: 'bi-clock-history', tone: 'danger' },
  DEAD_STOCK: { icon: 'bi-box2-heart', tone: 'danger' },
  OVERSTOCK: { icon: 'bi-box-seam', tone: 'muted' },
};

const SEVERITY_TONE = { CRITICAL: 'danger', HIGH: 'warning', MEDIUM: 'muted', LOW: 'success' };

/** Live alerts for the timeline panel. The trailing tag is the severity, not a
 *  time: these are generated on request, so every timestamp would read "now". */
export function toAlerts(notifications, limit = 6) {
  return notifications.slice(0, limit).map((item, index) => {
    const style = ALERT_STYLE[item.notification_type] || { icon: 'bi-info-circle', tone: 'muted' };
    return {
      id: `${item.product_id}-${index}`,
      icon: style.icon,
      tone: SEVERITY_TONE[item.severity] || style.tone,
      title: item.product_name,
      detail: item.message,
      time: item.severity,
    };
  });
}

// How each recommendation type should read on the card.
const RECOMMENDATION_STYLE = {
  RESTOCK: { icon: 'bi-arrow-repeat', tone: 'gold', verb: 'Reorder' },
  NEAR_EXPIRY_ACTION: { icon: 'bi-tag', tone: 'warning', verb: 'Act on expiry for' },
  DEAD_STOCK_ACTION: { icon: 'bi-box2-heart', tone: 'danger', verb: 'Review dead stock:' },
  OVERSTOCK_REDUCTION: { icon: 'bi-box-seam', tone: 'sage', verb: 'Reduce ordering of' },
  HEALTHY_INVENTORY: { icon: 'bi-check-circle', tone: 'soft', verb: 'Healthy:' },
};

const PRIORITY_LABEL = { CRITICAL: 'Critical', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };

/** The top few recommendations, shaped for the decision cards. */
export function toRecommendations(recommendations, limit = 3) {
  return recommendations
    .filter((item) => item.recommendation_type !== 'HEALTHY_INVENTORY')
    .slice(0, limit)
    .map((item, index) => {
      const style = RECOMMENDATION_STYLE[item.recommendation_type] || RECOMMENDATION_STYLE.HEALTHY_INVENTORY;
      return {
        id: `${item.product_id}-${index}`,
        priority: PRIORITY_LABEL[item.recommendation_priority] || item.recommendation_priority,
        tone: style.tone,
        icon: style.icon,
        title: `${style.verb} ${item.product_name}`,
        reason: item.recommendation_message,
        // The evidence behind the advice, straight from the analytics result.
        impact: `${item.current_stock} in stock against predicted demand of ${item.predicted_quantity}.`,
      };
    });
}
