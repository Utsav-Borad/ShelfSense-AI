import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Frontend-only gate. Real authorization still belongs to the API — this only
// keeps the UI honest about what it shows.
//
// Wrap a page with it:
//   <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
//
// `requireBusiness` sends a signed-in owner who has not finished setup to
// /business-setup, which is the documented first-login flow.
export default function ProtectedRoute({ children, requireBusiness = true }) {
  const { isAuthenticated, hasBusiness, isBootstrapping } = useAuth();

  if (isBootstrapping) return <LoadingSpinner label="Restoring your session" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requireBusiness && !hasBusiness) return <Navigate to="/business-setup" replace />;
  return children;
}
