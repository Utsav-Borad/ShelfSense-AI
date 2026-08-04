// Admin Command Center placeholder data. Nothing here comes from an API.

export const PLATFORM_HEALTH = { score: 96, status: 'Excellent' };

// The brief lines. Each counts its own number as it lands.
export const BRIEF_LINES = [
  { id: 'b1', value: 248, label: 'businesses active', icon: 'bi-shop', tone: 'success' },
  { id: 'b2', value: 1245, label: 'AI recommendations generated', icon: 'bi-stars', tone: 'gold' },
  { id: 'b3', value: 97, label: 'CSV synchronizations completed', icon: 'bi-cloud-check', tone: 'olive' },
  { id: 'b4', value: 99.8, suffix: '%', decimals: 1, label: 'platform uptime', icon: 'bi-activity', tone: 'success' },
  { id: 'b5', value: 0, label: 'critical system alerts', icon: 'bi-shield-check', tone: 'success', zeroWord: 'No' },
  { id: 'b6', value: 4, label: 'new users registered today', icon: 'bi-person-plus', tone: 'primary' },
];

export const PLATFORM_KPIS = [
  { id: 'users', label: 'Active users', value: 1842, icon: 'bi-people', tone: 'primary', delta: 6.2, note: 'signed in this week' },
  { id: 'businesses', label: 'Businesses registered', value: 248, icon: 'bi-shop', tone: 'olive', delta: 4.1, note: 'across 8 verticals' },
  { id: 'reports', label: 'Reports generated', value: 3164, icon: 'bi-file-earmark-text', tone: 'sage', delta: 11.4, note: 'this month' },
  { id: 'recommendations', label: 'AI recommendations served', value: 1245, icon: 'bi-stars', tone: 'gold', delta: 18.6, note: 'today' },
  { id: 'sync', label: 'CSV sync success rate', value: 98.4, suffix: '%', decimals: 1, icon: 'bi-cloud-check', tone: 'success', delta: 1.2, note: 'last 30 days' },
  { id: 'uptime', label: 'System uptime', value: 99.8, suffix: '%', decimals: 1, icon: 'bi-activity', tone: 'success', delta: 0.1, note: 'rolling 90 days' },
];

export const SYSTEM_STATUS = [
  { id: 'api', label: 'API', state: 'operational', detail: '142ms median response' },
  { id: 'db', label: 'Database', state: 'operational', detail: '38% of capacity' },
  { id: 'sync', label: 'CSV engine', state: 'operational', detail: '97 runs today' },
  { id: 'ai', label: 'AI models', state: 'degraded', detail: 'Forecast retraining, 12 min remaining' },
  { id: 'mail', label: 'Email delivery', state: 'operational', detail: '312 sent today' },
];

export const STATE_META = {
  operational: { label: 'Operational', tone: 'success', icon: 'bi-check-circle' },
  degraded: { label: 'Degraded', tone: 'warning', icon: 'bi-exclamation-triangle' },
  down: { label: 'Down', tone: 'danger', icon: 'bi-x-circle' },
};

export const ACTIVITY = [
  { id: 'a1', icon: 'bi-person-plus', tone: 'primary', title: 'New business registered', detail: 'Krishna Provision Store · Grocery · Ahmedabad', time: '2 min ago' },
  { id: 'a2', icon: 'bi-cloud-check', tone: 'success', title: 'Synchronization completed', detail: 'SUP-0142 · 412 rows accepted', time: '9 min ago' },
  { id: 'a3', icon: 'bi-stars', tone: 'gold', title: 'AI batch completed', detail: '248 businesses scored · 1,245 recommendations', time: '24 min ago' },
  { id: 'a4', icon: 'bi-exclamation-triangle', tone: 'warning', title: 'Forecast model retraining', detail: 'Scheduled maintenance · 12 min remaining', time: '38 min ago' },
  { id: 'a5', icon: 'bi-shield-lock', tone: 'olive', title: 'Role changed', detail: 'meera@freshmart.in promoted to Admin', time: '1 hr ago' },
  { id: 'a6', icon: 'bi-file-earmark-text', tone: 'sage', title: 'Daily reports dispatched', detail: '248 reports emailed', time: '3 hrs ago' },
  { id: 'a7', icon: 'bi-database-check', tone: 'success', title: 'Backup completed', detail: 'Nightly snapshot · 4.2 GB', time: '6 hrs ago' },
  { id: 'a8', icon: 'bi-x-circle', tone: 'danger', title: 'Synchronization rejected', detail: 'SUP-0138 · invalid_dates in sale_date', time: '8 hrs ago' },
];

// Only two roles exist on the backend User model (admin / user). The panel
// below reflects that rather than inventing a hierarchy the API cannot store.
export const ROLES = [
  {
    id: 'admin', label: 'Admin', tone: 'gold', users: 6,
    description: 'Full platform access, including user management and system settings.',
    permissions: ['Manage users and roles', 'View every business', 'Create products', 'Access audit logs', 'Change system settings', 'Trigger backups'],
  },
  {
    id: 'user', label: 'Business owner', tone: 'olive', users: 1836,
    description: 'Owns a single business and sees only their own data.',
    permissions: ['Manage their own business', 'Upload CSV reports', 'View analytics and AI insights', 'Generate reports', 'Manage their suppliers'],
    denied: ['Manage users', 'Create products directly', 'Access audit logs'],
  },
];

export const USERS = [
  { id: 'u1', name: 'Utsav Borad', email: 'owner@shelfsense.ai', role: 'admin', status: 'active', business: 'Borad Provision Store', joined: '12 Jan 2026', lastActive: '2 min ago', syncs: 142, recommendations: 486 },
  { id: 'u2', name: 'Meera Shah', email: 'meera@freshmart.in', role: 'admin', status: 'active', business: 'Fresh Mart', joined: '04 Feb 2026', lastActive: '1 hr ago', syncs: 118, recommendations: 402 },
  { id: 'u3', name: 'Rajesh Patel', email: 'rajesh@patelstores.in', role: 'user', status: 'active', business: 'Patel Stores', joined: '19 Feb 2026', lastActive: '3 hrs ago', syncs: 96, recommendations: 318 },
  { id: 'u4', name: 'Anita Desai', email: 'anita@dairypoint.in', role: 'user', status: 'active', business: 'Dairy Point', joined: '02 Mar 2026', lastActive: 'Yesterday', syncs: 84, recommendations: 271 },
  { id: 'u5', name: 'Vikram Joshi', email: 'vikram@joshimedicals.in', role: 'user', status: 'inactive', business: 'Joshi Medicals', joined: '14 Mar 2026', lastActive: '3 weeks ago', syncs: 12, recommendations: 34 },
  { id: 'u6', name: 'Priya Nair', email: 'priya@sunrisebakery.in', role: 'user', status: 'active', business: 'Sunrise Bakery', joined: '28 Mar 2026', lastActive: '5 hrs ago', syncs: 71, recommendations: 226 },
  { id: 'u7', name: 'Karan Mehta', email: 'karan@mehtagrocers.in', role: 'user', status: 'invited', business: 'Mehta Grocers', joined: '02 Aug 2026', lastActive: 'Never', syncs: 0, recommendations: 0 },
  { id: 'u8', name: 'Sneha Rao', email: 'sneha@organicbasket.in', role: 'user', status: 'active', business: 'Organic Basket', joined: '11 Apr 2026', lastActive: 'Yesterday', syncs: 63, recommendations: 194 },
  { id: 'u9', name: 'Arjun Kulkarni', email: 'arjun@petpantry.in', role: 'user', status: 'inactive', business: 'Pet Pantry', joined: '23 Apr 2026', lastActive: '1 month ago', syncs: 8, recommendations: 19 },
  { id: 'u10', name: 'Divya Menon', email: 'divya@cosmeticave.in', role: 'user', status: 'active', business: 'Cosmetic Avenue', joined: '07 May 2026', lastActive: '2 days ago', syncs: 47, recommendations: 152 },
  { id: 'u11', name: 'Rohit Sharma', email: 'rohit@frozenfresh.in', role: 'user', status: 'active', business: 'Frozen Fresh', joined: '19 May 2026', lastActive: '4 hrs ago', syncs: 55, recommendations: 168 },
  { id: 'u12', name: 'Neha Gupta', email: 'neha@guptamart.in', role: 'user', status: 'invited', business: 'Gupta Mart', joined: '04 Aug 2026', lastActive: 'Never', syncs: 0, recommendations: 0 },
];

export const USER_STATUS = {
  active: { label: 'Active', tone: 'success' },
  inactive: { label: 'Inactive', tone: 'danger' },
  invited: { label: 'Invited', tone: 'warning' },
};

export const AUDIT_LOGS = [
  { id: 'l1', actor: 'utsav@shelfsense.ai', action: 'role.update', target: 'meera@freshmart.in', detail: 'Role changed from user to admin', time: 'Today 09:41', tone: 'warning' },
  { id: 'l2', actor: 'system', action: 'backup.complete', target: 'nightly-snapshot', detail: '4.2 GB written to cold storage', time: 'Today 03:00', tone: 'success' },
  { id: 'l3', actor: 'meera@freshmart.in', action: 'user.deactivate', target: 'vikram@joshimedicals.in', detail: 'Account deactivated after 21 days of inactivity', time: 'Yesterday 16:22', tone: 'danger' },
  { id: 'l4', actor: 'system', action: 'sync.reject', target: 'SUP-0138', detail: 'invalid_dates in sale_date · rows 3, 41', time: 'Yesterday 11:08', tone: 'danger' },
  { id: 'l5', actor: 'utsav@shelfsense.ai', action: 'settings.update', target: 'email.daily_reports', detail: 'Daily report dispatch time moved to 06:00', time: '2 days ago', tone: 'olive' },
  { id: 'l6', actor: 'system', action: 'model.retrain', target: 'demand-forecast', detail: 'Confidence improved from 91% to 94%', time: '3 days ago', tone: 'success' },
  { id: 'l7', actor: 'utsav@shelfsense.ai', action: 'user.invite', target: 'karan@mehtagrocers.in', detail: 'Invitation sent', time: '3 days ago', tone: 'primary' },
];

export const ANALYTICS = {
  signups: { values: [12, 18, 15, 22, 19, 27, 31], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  syncs: { values: [64, 72, 68, 84, 79, 91, 97], labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
};

export const SETTINGS = [
  { id: 's1', label: 'New business registrations', detail: 'Allow new owners to create an account.', enabled: true },
  { id: 's2', label: 'Daily report dispatch', detail: 'Email the daily summary at 06:00 IST.', enabled: true },
  { id: 's3', label: 'AI recommendations', detail: 'Run the six prediction models after each sync.', enabled: true },
  { id: 's4', label: 'Maintenance mode', detail: 'Show a holding page and pause synchronization.', enabled: false },
  { id: 's5', label: 'Verbose audit logging', detail: 'Record read operations as well as writes.', enabled: false },
];

export const BACKUPS = [
  { id: 'bk1', label: 'Nightly snapshot', size: '4.2 GB', when: 'Today 03:00', state: 'success' },
  { id: 'bk2', label: 'Nightly snapshot', size: '4.1 GB', when: 'Yesterday 03:00', state: 'success' },
  { id: 'bk3', label: 'Weekly archive', size: '28.6 GB', when: '3 days ago', state: 'success' },
  { id: 'bk4', label: 'Nightly snapshot', size: '—', when: '5 days ago', state: 'failed' },
];

export const SUPPORT = {
  open: 7, waiting: 3, resolvedToday: 12, medianResponse: '1h 40m',
  tickets: [
    { id: 'T-4821', subject: 'CSV upload rejected without a clear reason', business: 'Patel Stores', priority: 'high', age: '2 hrs' },
    { id: 'T-4818', subject: 'Forecast confidence dropped after a missed sync', business: 'Dairy Point', priority: 'medium', age: '6 hrs' },
    { id: 'T-4815', subject: 'Request to change registered GST number', business: 'Fresh Mart', priority: 'low', age: '1 day' },
    { id: 'T-4809', subject: 'Supplier report shows an archived supplier', business: 'Sunrise Bakery', priority: 'medium', age: '2 days' },
  ],
};

export function greetingFor(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
