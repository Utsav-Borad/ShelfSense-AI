// The account list, from GET /auth/users/ (administrators only).
//
// The API returns id, full_name, email, role and created_at. Per-account
// business name, last-active time, sync counts and recommendation counts are
// not exposed by any endpoint, so those columns are gone rather than invented.

/** Users shaped for the admin table. */
export function toUsers(users) {
  return users.map((user) => ({
    id: `u${user.id}`,
    name: user.full_name,
    email: user.email,
    role: user.role,
    // The model has no deactivation flag on the API surface, so every account
    // the endpoint returns is a live one.
    status: 'active',
    joined: new Date(user.created_at).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    }),
  }));
}
