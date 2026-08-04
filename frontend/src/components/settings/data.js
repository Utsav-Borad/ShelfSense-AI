// Settings & Personalization placeholder data. Nothing is persisted to an API.

export const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: 'bi-person', hint: 'Who you are' },
  { id: 'business', label: 'Business', icon: 'bi-shop', hint: 'Your shop details' },
  { id: 'appearance', label: 'Appearance', icon: 'bi-palette', hint: 'Theme and accent' },
  { id: 'notifications', label: 'Notifications', icon: 'bi-bell', hint: 'What reaches you' },
  { id: 'security', label: 'Security', icon: 'bi-shield-lock', hint: 'Password and sessions' },
  { id: 'ai', label: 'AI preferences', icon: 'bi-stars', hint: 'How the assistant behaves' },
  { id: 'data', label: 'Data & privacy', icon: 'bi-database', hint: 'Export and deletion' },
  { id: 'integrations', label: 'Integrations', icon: 'bi-plug', hint: 'Connected services' },
  { id: 'system', label: 'System', icon: 'bi-sliders', hint: 'Language and defaults' },
];

// The hero summary lines.
export const PERSONALIZATION = [
  { id: 'p1', label: 'Daily Business Brief', value: 'Enabled', icon: 'bi-sun' },
  { id: 'p2', label: 'AI Recommendations', value: 'High accuracy', icon: 'bi-stars' },
  { id: 'p3', label: 'Inventory Alerts', value: 'Active', icon: 'bi-boxes' },
  { id: 'p4', label: 'Weekly Executive Reports', value: 'Scheduled', icon: 'bi-file-earmark-text' },
  { id: 'p5', label: 'Theme', value: 'Warm Beige (Dark)', icon: 'bi-palette' },
  { id: 'p6', label: 'Notification Priority', value: 'Smart', icon: 'bi-bell' },
];

// Documented target verticals.
export const SHOP_TYPES = ['Grocery', 'Medical', 'Bakery', 'Dairy', 'Cosmetic', 'Organic food', 'Frozen food', 'Pet food', 'Other'];

export const TIMEZONES = [
  'Asia/Kolkata (IST, GMT+5:30)',
  'Asia/Dubai (GST, GMT+4)',
  'Asia/Singapore (SGT, GMT+8)',
  'Europe/London (GMT+0)',
];

export const ACCENTS = [
  { id: 'beige', label: 'Warm Beige', swatch: '#D9B98B', available: true },
  { id: 'olive', label: 'Olive Grove', swatch: '#8FA77B', available: false },
  { id: 'clay', label: 'Terracotta', swatch: '#C97F5C', available: false },
  { id: 'slate', label: 'Slate', swatch: '#8C99A8', available: false },
];

export const NOTIFICATION_PREFS = [
  { id: 'email', label: 'Email notifications', detail: 'Daily brief, weekly summary and anything urgent.', enabled: true },
  { id: 'push', label: 'Push notifications', detail: 'Browser alerts while ShelfSense is open.', enabled: true },
  { id: 'ai', label: 'AI alerts', detail: 'Tell me when a recommendation needs a decision.', enabled: true },
  { id: 'reports', label: 'Report ready', detail: 'Notify me when a scheduled report is generated.', enabled: false },
];

export const NOTIFICATION_PRIORITY = [
  { id: 'all', label: 'Everything', detail: 'Send every notification as it happens.' },
  { id: 'smart', label: 'Smart', detail: 'Group the routine ones, send the urgent ones immediately.' },
  { id: 'critical', label: 'Critical only', detail: 'Only stockouts, expiry risk and failed synchronizations.' },
];

export const BRIEF_FREQUENCY = [
  { id: 'daily', label: 'Daily', detail: 'A brief every morning at 06:00.' },
  { id: 'weekdays', label: 'Weekdays', detail: 'Monday to Saturday, skipping Sunday.' },
  { id: 'weekly', label: 'Weekly', detail: 'One consolidated brief on Monday.' },
];

export const SENSITIVITY = [
  { id: 'conservative', label: 'Conservative', detail: 'Only recommend when the signal is unambiguous. Fewer, safer suggestions.' },
  { id: 'balanced', label: 'Balanced', detail: 'The default. Acts on a clear trend without waiting for certainty.' },
  { id: 'aggressive', label: 'Aggressive', detail: 'Surface early signals. More suggestions, more false positives.' },
];

export const SESSIONS = [
  { id: 's1', device: 'Chrome on Windows', location: 'Ahmedabad, India', ip: '103.21.•••.•••', when: 'Active now', current: true },
  { id: 's2', device: 'Safari on iPhone', location: 'Ahmedabad, India', ip: '103.21.•••.•••', when: '3 hours ago', current: false },
  { id: 's3', device: 'Chrome on Android', location: 'Surat, India', ip: '49.36.•••.•••', when: 'Yesterday', current: false },
];

export const INTEGRATIONS = [
  { id: 'i1', name: 'POS CSV export', detail: 'The three reports ShelfSense reads each day.', icon: 'bi-filetype-csv', status: 'connected' },
  { id: 'i2', name: 'Email delivery', detail: 'Daily and weekly reports to your inbox.', icon: 'bi-envelope', status: 'connected' },
  { id: 'i3', name: 'WhatsApp alerts', detail: 'Critical stock alerts to your phone.', icon: 'bi-whatsapp', status: 'available' },
  { id: 'i4', name: 'Accounting export', detail: 'Push revenue and purchase data to Tally.', icon: 'bi-calculator', status: 'available' },
];

export const LANGUAGES = ['English (India)', 'हिन्दी', 'ગુજરાતી'];
export const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
export const START_PAGES = ['Dashboard', 'AI Decision Center', 'Inventory', 'Analytics'];
