import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { homeFor } from './home';

// Keeps a signed-in user off /login and /register, sending them to whichever
// page is home for their account. To reach the sign-in form again, sign out.
export default function PublicOnlyRoute({ children }) {
  const { user, business, isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) return <LoadingSpinner label="Restoring your session" />;
  if (isAuthenticated) return <Navigate to={homeFor(user, business)} replace />;
  return children;
}
