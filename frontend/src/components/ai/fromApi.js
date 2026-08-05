// Turns the recommendation engine's output into the decision cards.
//
// The engine returns a product id, a type, a priority, a message and the stock
// evidence behind it. Rupee figures are produced here by joining each product's
// selling price, so every number on the page traces back to real data.
//
// The engine ranks by priority and emits no confidence score, so nothing on
// this page shows one.

const STYLE = {
  RESTOCK: {
    icon: 'bi-arrow-repeat', category: 'Reorder', verb: 'Reorder',
    timeline: 'Before the next delivery cycle',
    impactLabel: 'predicted demand to cover',
  },
  NEAR_EXPIRY_ACTION: {
    icon: 'bi-tag', category: 'Pricing', verb: 'Act on expiry for',
    timeline: 'Before the batch expires',
    impactLabel: 'value at risk',
  },
  DEAD_STOCK_ACTION: {
    icon: 'bi-box2-heart', category: 'Dead stock', verb: 'Clear',
    timeline: 'Before the next purchase cycle',
    impactLabel: 'capital tied up',
  },
  OVERSTOCK_REDUCTION: {
    icon: 'bi-box-seam', category: 'Purchasing', verb: 'Reduce ordering of',
    timeline: 'At the next purchase decision',
    impactLabel: 'capital tied up',
  },
};

const PRIORITY = { CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'medium', LOW: 'low' };

const rupees = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`;

/** Recommendations shaped for the plan, priced from the product list. */
export function toDecisions(recommendations, products) {
  const priceById = {};
  products.forEach((product) => { priceById[product.id] = Number(product.selling_price); });

  return recommendations
    .filter((item) => STYLE[item.recommendation_type])
    .map((item) => {
      const style = STYLE[item.recommendation_type];
      const price = priceById[item.product_id] || 0;
      const stock = item.current_stock;
      const predicted = item.predicted_quantity;

      // Reordering is about the demand that has to be served — the engine
      // flags low stock against the minimum stock level, not against predicted
      // demand, so a shortfall subtraction here can legitimately come out at
      // zero and read as "₹0 at stake". The other three types are about
      // capital already sitting on the shelf.
      const impactValue = item.recommendation_type === 'RESTOCK'
        ? predicted * price
        : stock * price;

      return {
        id: `rec-${item.product_id}`,
        productId: item.product_id,
        priority: PRIORITY[item.recommendation_priority] || 'low',
        icon: style.icon,
        category: style.category,
        title: `${style.verb} ${item.product_name}`,
        short: item.product_name,
        reason: `${item.recommendation_message} ${stock} in stock against predicted demand of ${predicted}.`,
        impact: `${rupees(impactValue)} of ${style.impactLabel} on this product.`,
        impactValue,
        impactLabel: style.impactLabel,
        timeline: style.timeline,
        urgency: item.inventory_health === 'CRITICAL'
          ? 'Needs a decision today.'
          : 'Worth deciding this week.',
        conversation: {
          happened: `${item.product_name} has ${stock} units on hand, and the model predicts demand of ${predicted}.`,
          why: `Stock reads as ${item.stock_status.toLowerCase().replace('_', ' ')} and expiry as ${item.expiry_status.toLowerCase().replace('_', ' ')}, which makes the overall position ${item.inventory_health.toLowerCase()}.`,
          next: item.recommendation_message,
          impact: `Around ${rupees(impactValue)} of ${style.impactLabel}, valued at the current selling price of ${rupees(price)} per unit.`,
        },
      };
    });
}

/** Risks, straight from the dashboard counts. */
export function toRisks(summary) {
  const risks = [];
  if (summary.expired > 0) {
    risks.push({
      id: 'expired', tone: 'danger', icon: 'bi-x-octagon', severity: 'High',
      title: `${summary.expired} products have already expired`,
      detail: 'These should come off the shelf and be written off.',
    });
  }
  if (summary.near_expiry > 0) {
    risks.push({
      id: 'expiry', tone: 'danger', icon: 'bi-clock-history', severity: 'High',
      title: `${summary.near_expiry} products expire within 30 days`,
      detail: 'A shallow discount now recovers more than a write-off later.',
    });
  }
  if (summary.low_stock > 0) {
    risks.push({
      id: 'low', tone: 'warning', icon: 'bi-arrow-down-circle', severity: 'Medium',
      title: `${summary.low_stock} products are below minimum stock`,
      detail: 'Each one risks a stockout before the next delivery.',
    });
  }
  if (summary.overstock > 0) {
    risks.push({
      id: 'overstock', tone: 'warning', icon: 'bi-box-seam', severity: 'Medium',
      title: `${summary.overstock} products are overstocked`,
      detail: `Capital is held in stock the model does not expect to sell soon.`,
    });
  }
  return risks;
}

/** Opportunities: the largest recoverable amounts, ranked by value.
 *  Basket analysis and trading-hours advice would need data the backend does
 *  not collect, so opportunities are drawn from capital that can be freed. */
export function toOpportunities(decisions, limit = 3) {
  return decisions
    .filter((item) => item.category === 'Dead stock' || item.category === 'Purchasing')
    .sort((a, b) => b.impactValue - a.impactValue)
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      icon: 'bi-cash-coin',
      title: `Free up capital in ${item.short}`,
      detail: item.reason,
      value: item.impactValue,
    }));
}

/** Headline figures for the copilot. */
export function toCopilotSummary(decisions, summary) {
  const analysed = summary.analysed_products || 1;
  const needsAction = decisions.length;
  return {
    // How much of the catalogue is in good shape, as a single number.
    score: Math.round(((analysed - needsAction) / analysed) * 100),
    improvement: decisions.reduce((sum, item) => sum + item.impactValue, 0),
    highlights: decisions.slice(0, 3),
  };
}
