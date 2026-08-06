// Where a signed-in account belongs when it lands on a route that is not for
// it — the sign-in pages, or a workspace page before setup is finished.
//
// One function so the guards cannot disagree: an administrator who runs no
// shop of their own was previously sent to /business-setup by every one of
// them, with no way out but signing out.
export function homeFor(user, business) {
  if (business) return '/dashboard';
  return user?.role === 'admin' ? '/admin' : '/business-setup';
}

export default homeFor;
