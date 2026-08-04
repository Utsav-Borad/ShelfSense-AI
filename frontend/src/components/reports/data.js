// Executive Reports placeholder data. Nothing here comes from an API.

export const HEALTH = { score: 91, status: 'Excellent' };

// The summary metrics, revealed one at a time. `value` is what counts up.
export const SUMMARY_METRICS = [
  { id: 'revenue', icon: 'bi-graph-up-arrow', label: 'Revenue increased by', value: 18, suffix: '%', tone: 'success' },
  { id: 'turnover', icon: 'bi-arrow-repeat', label: 'Inventory turnover improved by', value: 9, suffix: '%', tone: 'olive' },
  { id: 'dead', icon: 'bi-box2-heart', label: 'Dead stock reduced by', value: 12, suffix: '%', tone: 'olive' },
  { id: 'supplier', icon: 'bi-truck', label: 'Supplier reliability reached', value: 97, suffix: '%', tone: 'success' },
  { id: 'saved', icon: 'bi-shield-check', label: 'AI recommendations prevented an estimated', value: 28450, prefix: '₹', tone: 'gold', note: 'in potential losses' },
];

export const ASSESSMENT = 'Your business is performing above average. Focus on inventory optimization and supplier consistency to maximize next month’s growth.';

export const DATE_RANGES = [
  { id: 'month', label: 'This month' },
  { id: 'last', label: 'Last month' },
  { id: 'quarter', label: 'This quarter' },
  { id: 'year', label: 'This year' },
  { id: 'custom', label: 'Custom' },
];

export const FORMATS = [
  { id: 'pdf', label: 'PDF', icon: 'bi-filetype-pdf', note: 'Formatted for printing and sharing' },
  { id: 'excel', label: 'Excel', icon: 'bi-filetype-xlsx', note: 'Editable workbook with one sheet per section' },
  { id: 'csv', label: 'CSV', icon: 'bi-filetype-csv', note: 'Raw rows for your own analysis' },
];

// Six executive reports. `preview` is what the preview panel renders — a
// headline band, a short table and the sections the report would contain.
export const REPORTS = [
  {
    id: 'sales', title: 'Sales Report', icon: 'bi-receipt', tone: 'gold',
    summary: 'What sold, when, and what it earned across the period.',
    pages: 6, lastRun: '2 days ago',
    headline: [
      { label: 'Revenue', value: '₹64,600' },
      { label: 'Units sold', value: '3,660' },
      { label: 'Avg basket', value: '₹412' },
    ],
    columns: ['Product', 'Units', 'Revenue'],
    rows: [
      ['Toned Milk 1L', '742', '₹48,972'],
      ['Brown Bread 400g', '486', '₹25,272'],
      ['Amul Butter 500g', '312', '₹81,744'],
      ['Instant Noodles', '408', '₹23,664'],
    ],
    sections: ['Revenue by day', 'Top and bottom products', 'Category contribution', 'Discount impact', 'Basket analysis'],
  },
  {
    id: 'inventory', title: 'Inventory Report', icon: 'bi-boxes', tone: 'olive',
    summary: 'Stock position, expiry exposure and where capital is sitting.',
    pages: 8, lastRun: '2 days ago',
    headline: [
      { label: 'Inventory value', value: '₹2,16,500' },
      { label: 'Products', value: '418' },
      { label: 'Near expiry', value: '12' },
    ],
    columns: ['Status', 'Products', 'Value'],
    rows: [
      ['Healthy stock', '284', '₹1,52,400'],
      ['Slow moving', '67', '₹38,900'],
      ['Near expiry', '38', '₹18,400'],
      ['Dead stock', '29', '₹42,800'],
    ],
    sections: ['Stock by status', 'Expiry schedule', 'Dead stock register', 'Reorder points', 'Capital allocation'],
  },
  {
    id: 'products', title: 'Product Performance', icon: 'bi-tags', tone: 'sage',
    summary: 'Which products earn their shelf space and which do not.',
    pages: 7, lastRun: '5 days ago',
    headline: [
      { label: 'Performing', value: '96' },
      { label: 'Need action', value: '38' },
      { label: 'Avg AI score', value: '68' },
    ],
    columns: ['Product', 'Trend', 'AI score'],
    rows: [
      ['Toned Milk 1L', '+24%', '94'],
      ['Instant Noodles', '+16%', '89'],
      ['Cream Biscuits', '−19%', '31'],
      ['Cornflakes 475g', '−14%', '34'],
    ],
    sections: ['Growth leaders', 'Declining lines', 'Margin analysis', 'Category benchmarks', 'AI scoring method'],
  },
  {
    id: 'suppliers', title: 'Supplier Report', icon: 'bi-truck', tone: 'primary',
    summary: 'Who delivers on time, in full, and at the agreed price.',
    pages: 5, lastRun: '1 week ago',
    headline: [
      { label: 'Avg reliability', value: '83' },
      { label: 'Suppliers', value: '10' },
      { label: 'Late deliveries', value: '9' },
    ],
    columns: ['Supplier', 'On-time', 'Reliability'],
    rows: [
      ['Amul Depot', '96%', '97'],
      ['Sharma Distributors', '98%', '94'],
      ['Nova Traders', '71%', '68'],
      ['Vikram Supplies', '64%', '61'],
    ],
    sections: ['Reliability ranking', 'Delivery timeliness', 'Fill rate', 'Price variance', 'Rebalancing options'],
  },
  {
    id: 'ai', title: 'AI Recommendation Report', icon: 'bi-stars', tone: 'gold',
    summary: 'Every recommendation made, what you decided, and what followed.',
    pages: 9, lastRun: 'Yesterday',
    headline: [
      { label: 'Recommendations', value: '34' },
      { label: 'Accepted', value: '26' },
      { label: 'Value protected', value: '₹28,450' },
    ],
    columns: ['Recommendation', 'Decision', 'Outcome'],
    rows: [
      ['Reorder Amul Butter', 'Accepted', '₹4,280 protected'],
      ['Discount Fresh Cream', 'Accepted', '₹3,400 recovered'],
      ['Add third supplier', 'Dismissed', 'Terms preferred'],
      ['Clear dormant lines', 'Accepted', '₹11,900 freed'],
    ],
    sections: ['Recommendations issued', 'Acceptance rate', 'Realised impact', 'Confidence accuracy', 'Model notes'],
  },
  {
    id: 'business', title: 'Business Performance Summary', icon: 'bi-clipboard-data', tone: 'success',
    summary: 'The one-page read for anyone who needs the whole picture.',
    pages: 4, lastRun: 'Yesterday',
    headline: [
      { label: 'Health score', value: '91 / 100' },
      { label: 'Revenue growth', value: '+18%' },
      { label: 'Turnover', value: '4.1x' },
    ],
    columns: ['Metric', 'This period', 'Change'],
    rows: [
      ['Revenue', '₹64,600', '+18%'],
      ['Profit estimate', '₹15,504', '+9%'],
      ['Inventory turnover', '4.1x', '+9%'],
      ['Dead stock', '29 products', '−12%'],
    ],
    sections: ['Health score breakdown', 'Financial position', 'Operational metrics', 'Risks and opportunities', 'Next month outlook'],
  },
];

export const HISTORY = [
  { id: 'RPT-2041', report: 'Business Performance Summary', format: 'pdf', size: '412 KB', range: 'July 2026', when: 'Yesterday, 09:12' },
  { id: 'RPT-2040', report: 'AI Recommendation Report', format: 'pdf', size: '688 KB', range: 'July 2026', when: 'Yesterday, 09:12' },
  { id: 'RPT-2039', report: 'Sales Report', format: 'excel', size: '1.2 MB', range: 'Jul 1 – Jul 31', when: '2 days ago' },
  { id: 'RPT-2038', report: 'Inventory Report', format: 'pdf', size: '904 KB', range: 'Jul 1 – Jul 31', when: '2 days ago' },
  { id: 'RPT-2037', report: 'Product Performance', format: 'csv', size: '218 KB', range: 'Q2 2026', when: '5 days ago' },
  { id: 'RPT-2036', report: 'Supplier Report', format: 'pdf', size: '356 KB', range: 'Q2 2026', when: '1 week ago' },
];

export const getReport = (id) => REPORTS.find((report) => report.id === id);
