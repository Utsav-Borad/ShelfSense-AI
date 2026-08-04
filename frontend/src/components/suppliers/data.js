// Supplier Intelligence placeholder data. Nothing here comes from an API.

export const CATEGORIES = ['Dairy', 'Bakery', 'Packaged', 'Household', 'Personal care', 'Beverages'];

export const STATUS_META = {
  preferred: { label: 'Preferred', tone: 'success', icon: 'bi-award' },
  reliable: { label: 'Reliable', tone: 'olive', icon: 'bi-check-circle' },
  watch: { label: 'Watch', tone: 'warning', icon: 'bi-eye' },
  risk: { label: 'At risk', tone: 'danger', icon: 'bi-exclamation-triangle' },
};

// [name, code, categories, reliability, onTime, fillRate, priceVariance,
//  purchases, orders, avgDays, lastDeliveryDaysAgo, delayedRecent]
const RAW = [
  ['Sharma Distributors', 'SUP-01', ['Dairy', 'Packaged'], 94, 98, 97, 1.8, 486000, 41, 2.4, 1, 0],
  ['Amul Depot', 'SUP-02', ['Dairy'], 97, 96, 99, 0.9, 612000, 58, 1.6, 0, 0],
  ['Sunrise Bakers', 'SUP-03', ['Bakery'], 92, 95, 96, 1.9, 204000, 33, 1.9, 1, 0],
  ['Gujarat Foods', 'SUP-04', ['Bakery', 'Beverages'], 91, 94, 95, 2.4, 372000, 36, 2.8, 2, 1],
  ['Meera Enterprises', 'SUP-05', ['Personal care', 'Household'], 88, 90, 94, 2.6, 241000, 27, 2.9, 2, 1],
  ['Patel Agencies', 'SUP-06', ['Packaged'], 85, 88, 92, 3.1, 298000, 29, 3.2, 3, 1],
  ['Shakti Wholesale', 'SUP-07', ['Household'], 79, 82, 90, 4.0, 186000, 21, 3.8, 4, 2],
  ['Krishna Beverages', 'SUP-08', ['Beverages'], 73, 76, 86, 5.4, 158000, 19, 4.4, 5, 2],
  ['Nova Traders', 'SUP-09', ['Packaged', 'Personal care'], 68, 71, 84, 6.2, 214000, 24, 4.9, 6, 3],
  ['Vikram Supplies', 'SUP-10', ['Packaged', 'Household'], 61, 64, 78, 7.8, 122000, 15, 5.6, 9, 4],
];

function statusOf(reliability) {
  if (reliability >= 92) return 'preferred';
  if (reliability >= 82) return 'reliable';
  if (reliability >= 70) return 'watch';
  return 'risk';
}

export const SUPPLIERS = RAW.map((row, index) => {
  const [name, code, categories, reliability, onTime, fillRate, priceVariance,
    purchases, orders, avgDays, lastDeliveryDaysAgo, delayedRecent] = row;
  return {
    id: index + 1, name, code, categories, reliability, onTime, fillRate, priceVariance,
    purchases, orders, avgDays, lastDeliveryDaysAgo, delayedRecent,
    initials: name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase(),
    lastDelivery: lastDeliveryDaysAgo === 0 ? 'Today' : lastDeliveryDaysAgo === 1 ? 'Yesterday' : `${lastDeliveryDaysAgo} days ago`,
    status: statusOf(reliability),
  };
});

// The brief. Every figure is read off the data, and each line names a distinct
// supplier so four sentences do not all point at the same one.
export function supplierIntelligence(suppliers) {
  const bestOnTime = [...suppliers].sort((a, b) => b.onTime - a.onTime)[0];
  const mostDelayed = [...suppliers].sort((a, b) => b.delayedRecent - a.delayedRecent)[0];
  const mostReliable = [...suppliers]
    .filter((supplier) => supplier.id !== bestOnTime.id)
    .sort((a, b) => b.reliability - a.reliability)[0];
  const named = [bestOnTime.id, mostDelayed.id, mostReliable.id];
  // Best value among the preferred names we have not already used: high
  // reliability, low price drift.
  const recommend = [...suppliers]
    .filter((supplier) => !named.includes(supplier.id) && supplier.status === 'preferred')
    .sort((a, b) => (b.reliability - b.priceVariance * 2) - (a.reliability - a.priceVariance * 2))[0]
    || [...suppliers].filter((supplier) => !named.includes(supplier.id)).sort((a, b) => b.reliability - a.reliability)[0];

  const averageReliability = Math.round(
    suppliers.reduce((sum, supplier) => sum + supplier.reliability, 0) / suppliers.length,
  );

  return {
    averageReliability,
    preferred: suppliers.filter((supplier) => supplier.status === 'preferred').length,
    atRisk: suppliers.filter((supplier) => supplier.status === 'risk').length,
    totalSpend: suppliers.reduce((sum, supplier) => sum + supplier.purchases, 0),
    lines: [
      { id: 'ontime', text: `${bestOnTime.name} has maintained a ${bestOnTime.onTime}% on-time delivery rate.`, highlight: [bestOnTime.id], filter: { status: 'preferred' } },
      { id: 'delayed', text: `${mostDelayed.name} have delayed ${mostDelayed.delayedRecent} recent deliveries.`, highlight: [mostDelayed.id], filter: { status: mostDelayed.status } },
      { id: 'reliable', text: `${mostReliable.name} has the highest reliability this month (${mostReliable.reliability}/100).`, highlight: [mostReliable.id], filter: { status: 'preferred' } },
      { id: 'recommend', text: `AI recommends increasing purchases from ${recommend.name}.`, highlight: [recommend.id], filter: { status: recommend.status } },
    ],
  };
}

export const SORTS = [
  { value: 'reliability', label: 'Reliability' },
  { value: 'onTime', label: 'On-time rate' },
  { value: 'purchases', label: 'Total purchases' },
  { value: 'avgDays', label: 'Delivery time' },
  { value: 'name', label: 'Name' },
];

// Placeholder recent deliveries for the drawer.
export const DELIVERIES = [
  { id: 1, ref: 'PUR-1042', items: 48, value: 18400, status: 'on-time', when: '1 day ago' },
  { id: 2, ref: 'PUR-1036', items: 62, value: 24100, status: 'on-time', when: '6 days ago' },
  { id: 3, ref: 'PUR-1029', items: 34, value: 12600, status: 'late', when: '12 days ago' },
  { id: 4, ref: 'PUR-1021', items: 51, value: 19800, status: 'on-time', when: '18 days ago' },
  { id: 5, ref: 'PUR-1014', items: 44, value: 16200, status: 'short', when: '25 days ago' },
];
