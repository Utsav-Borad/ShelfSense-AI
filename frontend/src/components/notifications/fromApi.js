// Maps the notification engine's output onto the notification centre.
//
// Notifications are generated live from current inventory each time they are
// requested — nothing is stored server-side. So read/archived state is held in
// this session only, and every item is grouped under "today" because that is
// genuinely when it was produced.

const TYPE_BY_NOTIFICATION = {
  LOW_STOCK: 'low-stock',
  NEAR_EXPIRY: 'expiry',
  DEAD_STOCK: 'dead-stock',
  OVERSTOCK: 'overstock',
};

const PRIORITY_BY_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'critical',
  MEDIUM: 'warning',
  LOW: 'info',
};

/** Notifications shaped for the list. `analysisById` adds the stock evidence. */
export function toNotifications(notifications, recommendations) {
  const analysisById = {};
  recommendations.forEach((item) => { analysisById[item.product_id] = item; });

  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

  return notifications.map((item, index) => {
    const analysis = analysisById[item.product_id];
    const stock = analysis ? analysis.current_stock : null;
    const predicted = analysis ? analysis.predicted_quantity : null;

    return {
      id: `nt-${item.product_id}-${index}`,
      productId: item.product_id,
      type: TYPE_BY_NOTIFICATION[item.notification_type] || 'info',
      priority: PRIORITY_BY_SEVERITY[item.severity] || 'info',
      // Everything is produced at request time, so it all belongs to today.
      group: 'today',
      time,
      read: false,
      archived: false,
      title: `${item.product_name} — ${item.title.toLowerCase()}`,
      detail: item.message,
      meta: stock === null ? item.severity : `${stock} units in stock`,
      action: item.title,
      context: analysis
        ? `Stock reads as ${analysis.stock_status.toLowerCase().replace('_', ' ')} and expiry as ${analysis.expiry_status.toLowerCase().replace('_', ' ')}.`
        : 'No further analysis is available for this product.',
      impact: predicted === null
        ? 'The model could not produce a demand figure for this product.'
        : `Predicted demand for this product is ${predicted} against ${stock} on hand.`,
    };
  });
}

/** The morning brief, written from the real position. */
export function toBriefLines(summary, notifications) {
  const lines = [];
  const first = (type) => notifications.find((item) => item.type === type);

  if (summary.low_stock > 0) {
    const target = first('low-stock');
    lines.push({ id: 'bl-low', target: target && target.id, text: `${summary.low_stock} product(s) fell below minimum stock.` });
  }
  if (summary.near_expiry > 0) {
    const target = first('expiry');
    lines.push({ id: 'bl-exp', target: target && target.id, text: `${summary.near_expiry} product(s) are nearing expiry.` });
  }
  if (summary.expired > 0) {
    lines.push({ id: 'bl-expd', target: null, text: `${summary.expired} product(s) have already expired.` });
  }
  if (summary.overstock > 0) {
    const target = first('overstock');
    lines.push({ id: 'bl-over', target: target && target.id, text: `${summary.overstock} product(s) are overstocked against demand.` });
  }
  lines.push({
    id: 'bl-rev',
    target: null,
    text: `Revenue over the last 30 days is ₹${Math.round(summary.revenue_last_30_days).toLocaleString('en-IN')}.`,
  });
  if (lines.length === 1) {
    lines.unshift({ id: 'bl-ok', target: null, text: 'Nothing needs your attention this morning.' });
  }
  return lines;
}
