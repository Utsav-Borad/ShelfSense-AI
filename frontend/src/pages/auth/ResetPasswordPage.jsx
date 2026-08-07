import { Navigate } from 'react-router-dom';

// Resets no longer travel by link — a code is emailed instead, and the whole
// flow lives on /forgot-password so the email and the code stay in one place.
//
// The route is kept so an old reset link from a previous email still lands
// somewhere useful rather than on the 404 page.
export default function ResetPasswordPage() {
  return <Navigate to="/forgot-password" replace />;
}
