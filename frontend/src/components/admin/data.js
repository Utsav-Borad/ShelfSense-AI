// Static labels for the Admin Command Center. Every figure on the page comes
// from GET /auth/admin/overview/ and GET /auth/users/ — what is left here is
// only the wording around those numbers.

// The two roles the backend User model stores, and what each one can actually
// do. This is a description of enforced behaviour, not configuration: the
// permission classes on the API decide it, nothing here does.
export const ROLES = [
  {
    id: 'admin', label: 'Admin', tone: 'gold',
    description: 'Full platform access, including user management.',
    permissions: [
      'Manage user roles and access',
      'View platform-wide totals',
      'Create, edit and delete products',
      'Everything a business owner can do',
    ],
  },
  {
    id: 'user', label: 'Business owner', tone: 'olive',
    description: 'Owns a single business and sees only their own data.',
    permissions: [
      'Manage their own business',
      'Upload CSV reports',
      'View analytics and AI insights',
      'Generate reports',
      'Manage their suppliers',
    ],
    denied: ['Manage users', 'Create products directly', 'See platform totals'],
  },
];

// `is_active` on the User model is the only account state the API stores, so
// these are the only two an account can be in.
export const USER_STATUS = {
  active: { label: 'Active', tone: 'success' },
  inactive: { label: 'Inactive', tone: 'danger' },
};

export function greetingFor(hour) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
