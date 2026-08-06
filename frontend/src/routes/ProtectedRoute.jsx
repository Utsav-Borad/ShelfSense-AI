import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { homeFor } from './home';

// Frontend-only gate. Real authorization still belongs to the API — this only
// keeps the UI honest about what it shows.
//
// Wrap a page with it:
//   <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//
// `requireBusiness` sends a signed-in owner who has not finished setup to
// /business-setup, which is the documented first-login flow.
//
// `requireAdmin` sends a `user` role away from the admin pages. Hiding the link
// in the sidebar is not enough on its own — the address bar is still open to
// anyone — though the API is what actually protects the data: every admin
// endpoint carries IsAdminRole and answers a non-admin with 403.
export default function ProtectedRoute({ children, requireBusiness = true, requireAdmin = false }) {
  const { user, business, isAuthenticated, hasBusiness, isAdmin, isBootstrapping } = useAuth();

  if (isBootstrapping) return <LoadingSpinner label="Restoring your session" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (requireBusiness && !hasBusiness) return <Navigate to={homeFor(user, business)} replace />;
  return children;
}
