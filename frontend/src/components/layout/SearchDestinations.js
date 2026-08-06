// What the workspace search can take you to. Keywords cover the words people
// actually type — "stock" should find Inventory, "expiry" should too.
const DESTINATIONS = [
  { to: '/dashboard', label: 'Dashboard', hint: 'Business health and today’s brief', icon: 'bi-grid-1x2', keywords: 'home overview health kpi revenue profit summary decision' },
  { to: '/inventory', label: 'Inventory', hint: 'Stock, expiry and dead stock', icon: 'bi-box-seam', keywords: 'stock expiry near dead low minimum products shelf capital' },
  { to: '/products', label: 'Products', hint: 'Catalogue performance and AI scores', icon: 'bi-tags', keywords: 'catalogue catalog items demand trend score performing slow' },
  { to: '/suppliers', label: 'Suppliers', hint: 'Reliability and delivery performance', icon: 'bi-truck', keywords: 'vendor delivery reliability late on-time purchase orders' },
  { to: '/analytics', label: 'Analytics', hint: 'Revenue, turnover and forecasts', icon: 'bi-bar-chart-line', keywords: 'charts revenue sales turnover forecast category trends reports data' },
  { to: '/ai-insights', label: 'AI Decision Center', hint: 'Recommendations and today’s plan', icon: 'bi-stars', keywords: 'ai recommendations advice copilot plan opportunities risks decisions' },
  { to: '/reports', label: 'Reports', hint: 'Executive summaries and exports', icon: 'bi-file-earmark-text', keywords: 'export pdf excel csv summary executive download' },
  { to: '/notifications', label: 'Notifications', hint: 'Alerts and the morning brief', icon: 'bi-bell', keywords: 'alerts messages unread brief inbox archive' },
  { to: '/csv-upload', label: 'CSV Upload', hint: 'Synchronize your POS exports', icon: 'bi-cloud-arrow-up', keywords: 'sync synchronize import upload file validation history' },
  { to: '/settings', label: 'Settings', hint: 'Profile, appearance and AI preferences', icon: 'bi-gear', keywords: 'preferences profile password theme dark light security account privacy' },
  { to: '/admin', label: 'Admin', hint: 'Accounts, roles and platform totals', icon: 'bi-shield-check', keywords: 'users roles permissions accounts platform', adminOnly: true },
];

/** `isAdmin` keeps the admin console out of a business owner's results — the
 *  route sends them straight back, so offering it would be a dead end. */
export function searchDestinations(query, isAdmin = false) {
  const term = query.trim().toLowerCase();
  if (!term) return [];
  return DESTINATIONS
    .filter((item) => !item.adminOnly || isAdmin)
    .map((item) => {
      const label = item.label.toLowerCase();
      // Rank a label match above a keyword match, and a prefix above a
      // substring, so typing "in" lands on Inventory rather than Settings.
      let score = 0;
      if (label.startsWith(term)) score = 3;
      else if (label.includes(term)) score = 2;
      else if (`${item.hint} ${item.keywords}`.toLowerCase().includes(term)) score = 1;
      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label))
    .slice(0, 6);
}

export default DESTINATIONS;
