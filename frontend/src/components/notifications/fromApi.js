// Maps the notification engine's output onto the notification centre.
//
// Notifications are generated live from current inventory each time they are
// requested — nothing is stored server-side. So read/archived state is held in
// this session only, and every item is grouped under "today" because that is
// genuinely when it was produced.

// These must stay in step with TYPE_META and PRIORITY_META in ./data.js — the
// list renders TYPE_META[item.type].tone directly, so a key that is not in
// those maps crashes the page rather than degrading.
const TYPE_BY_NOTIFICATION = {
  LOW_STOCK: 'low-stock',
  NEAR_EXPIRY: 'near-expiry',
  DEAD_STOCK: 'dead-stock',
  OVERSTOCK: 'overstock',
};
const FALLBACK_TYPE = 'system-update';

// PRIORITY_META and the tabs use critical / important / general.
//
// The tier comes from the kind of alert, not from the engine's `severity`.
// NotificationRules gives every category a fixed severity (low stock, near
// expiry and dead stock are all HIGH), so severity says nothing that the type
// does not already say — reading it put three unrelated alerts behind one
// "Critical" tab and left "Important" holding overstock alone.
//
// The split that actually helps is by deadline. Critical alerts lose money if
// they are ignored this week: a low stock line stops selling, an expiring line
// becomes a write-off. Important alerts are money already tied up — dead and
// overstocked lines are worth freeing, but nothing gets worse by Friday.
const PRIORITY_BY_NOTIFICATION = {
  LOW_STOCK: 'critical',
  NEAR_EXPIRY: 'critical',
  DEAD_STOCK: 'important',
  OVERSTOCK: 'important',
  HEALTHY_INVENTORY: 'general',
};
const FALLBACK_PRIORITY = 'general';

/** A stable id, so read state survives a reload.
 *
 * The list position cannot be used — it moves as stock changes — and the engine
 * raises at most one alert per product, so product and type identify it. */
export function notificationId(item) {
  return `nt-${item.product_id}-${item.notification_type}`;
}

/** Notifications shaped for the list. `analysisById` adds the stock evidence. */
export function toNotifications(notifications, recommendations, readIds = []) {
  const analysisById = {};
  recommendations.forEach((item) => { analysisById[item.product_id] = item; });

  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

  return notifications.map((item) => {
    const analysis = analysisById[item.product_id];
    const stock = analysis ? analysis.current_stock : null;
    const predicted = analysis ? analysis.predicted_quantity : null;
    const id = notificationId(item);

    return {
      id,
      productId: item.product_id,
      type: TYPE_BY_NOTIFICATION[item.notification_type] || FALLBACK_TYPE,
      priority: PRIORITY_BY_NOTIFICATION[item.notification_type] || FALLBACK_PRIORITY,
      // Everything is produced at request time, so it all belongs to today.
      group: 'today',
      time,
      read: readIds.includes(id),
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
    const target = first('near-expiry');
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
