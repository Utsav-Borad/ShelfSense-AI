// The inventory table is driven by the API — see components/inventory/fromApi.js
// for the join and the mapping. What remains here is presentation config: how
// each status should look, and which columns can be toggled.

export const STATUS_META = {
  healthy: { label: 'Healthy', tone: 'success', icon: 'bi-check-circle' },
  low: { label: 'Low stock', tone: 'warning', icon: 'bi-arrow-down-circle', critical: true },
  expiring: { label: 'Near expiry', tone: 'danger', icon: 'bi-clock-history', critical: true },
  overstock: { label: 'Overstocked', tone: 'sage', icon: 'bi-box-seam' },
  dead: { label: 'Dead stock', tone: 'muted', icon: 'bi-box2-heart' },
};

export const COLUMNS = [
  { id: 'name', label: 'Product', always: true },
  { id: 'category', label: 'Category' },
  { id: 'supplier', label: 'Supplier' },
  { id: 'available', label: 'Stock' },
  { id: 'value', label: 'Value' },
  { id: 'expiry', label: 'Expiry' },
  { id: 'status', label: 'Status', always: true },
];
