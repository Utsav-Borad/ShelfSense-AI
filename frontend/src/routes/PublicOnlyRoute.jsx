import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Keeps a signed-in user off /login and /register. If they never finished
// business setup, that is where they belong instead of the dashboard.
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, hasBusiness, isBootstrapping } = useAuth();

  if (isBootstrapping) return <LoadingSpinner label="Restoring your session" />;
  if (isAuthenticated) return <Navigate to={hasBusiness ? '/dashboard' : '/business-setup'} replace />;
  return children;
}
