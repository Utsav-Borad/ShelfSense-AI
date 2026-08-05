// The dashboard is now driven by the API — see components/dashboard/fromApi.js
// for the mapping. What remains here is genuinely static: the quick-action tiles
// are navigation links, not data.

export const QUICK_ACTIONS = [
  { label: 'Upload CSV', icon: 'bi-cloud-arrow-up', to: '/csv-upload', hint: 'Sync today’s exports' },
  { label: 'View inventory', icon: 'bi-boxes', to: '/inventory', hint: 'Stock and expiry' },
  { label: 'AI insights', icon: 'bi-stars', to: '/ai-insights', hint: 'All recommendations' },
  { label: 'Reports', icon: 'bi-file-earmark-bar-graph', to: '/reports', hint: 'Export and share' },
];
