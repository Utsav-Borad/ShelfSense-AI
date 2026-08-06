// The admin page, from GET /auth/users/ and GET /auth/admin/overview/.
// Both are administrators-only; a `user` role gets 403 from either.

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Users shaped for the admin table.
 *
 * The API returns id, full_name, email, role, is_active and created_at. Last
 * active time, per-account sync counts and business name are not stored, so
 * those columns are gone rather than invented. */
export function toUsers(users) {
  return users.map((user) => ({
    id: user.id,
    name: user.full_name,
    email: user.email,
    role: user.role,
    status: user.is_active ? 'active' : 'inactive',
    joined: new Date(user.created_at).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }),
  }));
}

const money = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`;
const day = (value) => new Date(value).toLocaleDateString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric',
});

/** How long ago something happened, in the words a person would use. */
function since(value) {
  if (!value) return 'Never';
  const minutes = Math.round((Date.now() - new Date(value).getTime()) / 60000);
  if (minutes < 2) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  return day(value);
}

/** A shop and what it holds, for the account drawer and the business table. */
function toBusiness(shop) {
  if (!shop) return null;
  return {
    id: shop.id,
    name: shop.shop_name,
    type: shop.shop_type,
    address: shop.address,
    phone: shop.phone,
    gst: shop.gst_number || 'Not provided',
    created: day(shop.created_at),
    products: shop.stats.products,
    suppliers: shop.stats.suppliers,
    categories: shop.stats.categories,
    salesRecords: shop.stats.sales_records,
    revenue: shop.stats.revenue,
    revenueLabel: money(shop.stats.revenue),
    lastSale: shop.stats.last_sale_date ? day(shop.stats.last_sale_date) : 'No sales imported',
  };
}

/** Accounts from GET /auth/admin/accounts/, each with its shop attached. */
export function toAccounts(accounts) {
  return accounts.map((account) => ({
    id: account.id,
    name: account.full_name,
    email: account.email,
    role: account.role,
    status: account.is_active ? 'active' : 'inactive',
    joined: day(account.created_at),
    lastSeen: since(account.last_login),
    // Never signed in is worth seeing on its own — it separates an account that
    // was created and abandoned from one that is simply quiet.
    hasSignedIn: Boolean(account.last_login),
    business: toBusiness(account.business),
  }));
}

/** Businesses from GET /auth/admin/businesses/, each with its owner. */
export function toBusinesses(businesses) {
  return businesses.map((business) => ({
    ...toBusiness(business),
    owner: {
      id: business.owner.id,
      name: business.owner.full_name,
      email: business.owner.email,
      role: business.owner.role,
      status: business.owner.is_active ? 'active' : 'inactive',
    },
  }));
}

/** The brief: platform totals, with the ring showing how many registered
 *  businesses have actually imported a catalogue. */
export function toBrief(overview) {
  const { accounts, businesses, catalogue, sales } = overview;
  const coverage = businesses.total === 0
    ? 0
    : Math.round((businesses.with_products / businesses.total) * 100);

  return {
    coverage,
    coverageLabel: `${businesses.with_products} of ${businesses.total} businesses hold a catalogue`,
    lines: [
      { id: 'b1', value: accounts.total, label: 'accounts registered', icon: 'bi-people', tone: 'primary' },
      { id: 'b2', value: businesses.total, label: 'businesses set up', icon: 'bi-shop', tone: 'olive' },
      { id: 'b3', value: catalogue.products, label: 'products across the platform', icon: 'bi-box-seam', tone: 'sage' },
      { id: 'b4', value: sales.records, label: 'sales records imported', icon: 'bi-receipt', tone: 'gold' },
      { id: 'b5', value: accounts.inactive, label: 'accounts deactivated', icon: 'bi-person-dash', tone: 'success', zeroWord: 'No' },
      { id: 'b6', value: accounts.joined_last_7_days, label: 'accounts joined this week', icon: 'bi-person-plus', tone: 'primary' },
    ],
  };
}

/** The KPI row. No deltas — nothing is stored over time to compare against. */
export function toKpis(overview) {
  const { accounts, businesses, catalogue, sales } = overview;

  return [
    { id: 'accounts', label: 'Accounts', value: accounts.total, icon: 'bi-people', tone: 'primary', note: `${accounts.admins} admin, ${accounts.owners} owner` },
    { id: 'businesses', label: 'Businesses', value: businesses.total, icon: 'bi-shop', tone: 'olive', note: `${businesses.with_products} holding stock` },
    { id: 'products', label: 'Products', value: catalogue.products, icon: 'bi-box-seam', tone: 'sage', note: `${catalogue.inventory_records} with an inventory row` },
    { id: 'suppliers', label: 'Suppliers', value: catalogue.suppliers, icon: 'bi-truck', tone: 'primary', note: `across ${catalogue.categories} categories` },
    { id: 'sales', label: 'Sales records', value: sales.records, icon: 'bi-receipt', tone: 'gold', note: 'imported through CSV' },
    { id: 'revenue', label: 'Revenue recorded', value: Math.round(sales.revenue), prefix: '₹', icon: 'bi-currency-rupee', tone: 'success', note: 'across every business' },
  ];
}

/** Registrations per day for the last seven days, for the growth chart. */
export function toSignups(overview) {
  return {
    values: overview.signups.map((entry) => entry.count),
    labels: overview.signups.map((entry) => DAY_LABELS[new Date(entry.date).getDay()]),
  };
}

/** How many accounts hold each role, for the roles panel. */
export function toRoleCounts(overview) {
  return { admin: overview.accounts.admins, user: overview.accounts.owners };
}
