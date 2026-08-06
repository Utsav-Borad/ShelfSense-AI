// Business Analytics from the live aggregation endpoints.
//
// Four charts survive here, and every one is a real series or a real
// aggregate. Four were removed because the backend keeps no history of past
// positions — only the current one:
//
//   Inventory turnover     needs cost of goods sold and average inventory over
//                          time. Product has no cost field and past stock
//                          levels are never recorded.
//   Dead stock trend       only the current count exists.
//   Near expiry analysis   only the current count exists.
//   Demand forecast        comparing forecast to actual needs past forecasts
//                          stored to compare against; the engine predicts on
//                          demand and keeps nothing.
//
// Recording a snapshot at each CSV import would make all four possible.

const rupees = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`;

function shortDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return `${date.getDate()} ${date.toLocaleString('en-IN', { month: 'short' })}`;
}

// How many points each window shows. The API always returns the last 30 days,
// so the range selector trims that series rather than asking for a new one.
const POINTS = { daily: 1, weekly: 7, monthly: 30 };

function tail(series, range) {
  return series.slice(-(POINTS[range] || 30));
}

const TONES = ['gold', 'olive', 'sage', 'soft', 'warning', 'danger'];

/** Revenue per day for the selected window. */
export function toRevenueSeries(revenue, range) {
  const points = tail(revenue.series || [], range);
  return {
    values: points.map((point) => Number((point.revenue / 1000).toFixed(1))),
    labels: points.map((point) => shortDate(point.date)),
    headline: rupees(points.reduce((sum, point) => sum + point.revenue, 0)),
  };
}

/** Units sold per day for the selected window. */
export function toSalesSeries(trends, range) {
  const points = tail(trends.series || [], range);
  return {
    values: points.map((point) => point.units_sold),
    labels: points.map((point) => shortDate(point.date)),
    headline: points.reduce((sum, point) => sum + point.units_sold, 0).toLocaleString('en-IN'),
  };
}

/** Revenue share by product category. */
export function toCategorySplit(categories, limit = 5) {
  const rows = (categories.categories || []).slice(0, limit);
  return {
    segments: rows.map((row, index) => ({
      label: row.category_name,
      value: Math.round(row.share),
      tone: TONES[index % TONES.length],
    })),
    headline: rows.length ? `${Math.round(rows[0].share)}%` : '—',
    leader: rows.length ? rows[0].category_name : null,
  };
}

/** Capital held per supplier — the largest few. */
export function toSupplierShares(suppliers, limit = 8) {
  const rows = [...(suppliers.suppliers || [])]
    .sort((a, b) => b.stock_value - a.stock_value)
    .slice(0, limit);
  return {
    values: rows.map((row) => Math.round(row.stock_value)),
    // First word only: full distributor names do not fit under a bar.
    labels: rows.map((row) => row.supplier_name.split(' ')[0]),
    headline: String(suppliers.count || rows.length),
  };
}

/** The brief above the charts, written from the figures below it. */
export function toBriefLines(revenue, trends, categories, summary) {
  const units = (trends.series || []).reduce((sum, point) => sum + point.units_sold, 0);
  const leader = (categories.categories || [])[0];
  const lines = [
    { id: 'b-rev', chart: 'revenue', text: `Revenue over the period is ${rupees(revenue.total_revenue || 0)}.` },
    { id: 'b-units', chart: 'sales', text: `${units.toLocaleString('en-IN')} units sold across ${(trends.series || []).length} day(s).` },
  ];
  if (leader) {
    lines.push({
      id: 'b-cat',
      chart: 'category',
      text: `${leader.category_name} leads with ${Math.round(leader.share)}% of revenue.`,
    });
  }
  lines.push({ id: 'b-stock', chart: 'supplier', text: `${rupees(summary.stock_value)} of capital is held across ${summary.suppliers} suppliers.` });
  lines.push({
    id: 'b-health',
    chart: 'supplier',
    text: `${summary.low_stock + summary.overstock + summary.near_expiry} product(s) need attention.`,
  });
  return lines;
}

/** Explanations for each chart, composed from the same numbers it draws. */
export function toCharts(revenue, sales, category, supplier, summary) {
  return [
    {
      id: 'revenue', order: 0, kind: 'line', title: 'Revenue trend', caption: 'Revenue',
      tone: 'gold', headline: revenue.headline,
      explain: {
        summary: `Revenue across the window totals ${revenue.headline}.`,
        reason: 'Each point is one day of sales, summed from the sales records imported by CSV.',
        action: 'Compare the peaks against your stock cover on those days.',
      },
      conversation: {
        happened: `The window covers ${revenue.values.length} day(s), totalling ${revenue.headline} in revenue.`,
        why: 'This is a direct aggregation of the sales table — no model is involved, so it is exactly what your imports contain.',
        next: 'Use the category chart to see which part of the catalogue is carrying it.',
        impact: 'Revenue is the baseline every other figure on this page is judged against.',
      },
    },
    {
      id: 'sales', order: 1, kind: 'bar', title: 'Sales trend', caption: 'Units sold',
      tone: 'olive', headline: sales.headline,
      explain: {
        summary: `${sales.headline} units left the shelf across the window.`,
        reason: 'Units sold per day, taken straight from the sales records.',
        action: 'Cross-check the busiest days against the products flagged as low stock.',
      },
      conversation: {
        happened: `${sales.headline} units were sold over ${sales.values.length} day(s).`,
        why: 'Units and revenue can move apart when discounting changes, which is why both are shown.',
        next: 'The AI Decision Center lists the products the model expects to run short.',
        impact: 'Volume drives how quickly stock has to be replaced.',
      },
    },
    {
      id: 'category', order: 2, kind: 'donut', title: 'Category performance', caption: 'Revenue share',
      tone: 'sage', headline: category.headline,
      explain: {
        summary: category.leader
          ? `${category.leader} contributes the largest share of revenue.`
          : 'No category revenue in this window.',
        reason: 'Sales joined to each product’s category, then summed by revenue.',
        action: 'Protect availability in the leading category before widening the range.',
      },
      conversation: {
        happened: category.leader
          ? `${category.leader} leads on revenue share at ${category.headline}.`
          : 'There is no category revenue to report for this window.',
        why: 'Share is computed on revenue rather than units, so high-value lines are not hidden behind fast-moving cheap ones.',
        next: 'Check whether the leading category also holds the most capital in the supplier chart.',
        impact: 'Concentration tells you where a stockout would hurt most.',
      },
    },
    {
      id: 'supplier', order: 3, kind: 'bar', title: 'Capital by supplier', caption: 'Stock value',
      tone: 'gold', headline: supplier.headline,
      explain: {
        summary: `Capital is spread across ${supplier.headline} suppliers.`,
        reason: 'Available stock valued at selling price, grouped by supplier.',
        action: 'Review the largest holdings against how fast those products move.',
      },
      conversation: {
        happened: `${summary.suppliers} suppliers hold your stock, the largest few shown here by value.`,
        why: 'This is a footprint, not a performance score: no purchase orders or deliveries are recorded, so reliability cannot be measured.',
        next: 'The Suppliers page lists which products from each supplier need attention.',
        impact: 'Capital concentrated in one supplier is a risk if their delivery slips.',
      },
    },
  ];
}
