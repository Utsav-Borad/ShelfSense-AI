import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import NotFoundPage from '../pages/errors/NotFoundPage';
import ServerErrorPage from '../pages/errors/ServerErrorPage';
import ForbiddenPage from '../pages/auth/ForbiddenPage';
import LandingPage from '../pages/landing/LandingPage';
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
// Auth pages are imported normally — plain Routes and Route, nothing extra.
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import BusinessSetupPage from '../pages/auth/BusinessSetupPage';

// Workspace pages.
import Dashboard from '../pages/dashboard/DashboardPage';
import Inventory from '../pages/inventory/InventoryPage';
import Products from '../pages/inventory/ProductsPage';
import Suppliers from '../pages/inventory/SuppliersPage';
import CsvUpload from '../pages/inventory/CsvUploadPage';
import Analytics from '../pages/analytics/AnalyticsPage';
import AiInsights from '../pages/ai/AiInsightsPage';
import Reports from '../pages/reports/ReportsPage';
import Notifications from '../pages/notifications/NotificationsPage';
import Admin from '../pages/admin/AdminPage';
import Settings from '../pages/settings/SettingsPage';

export default function AppRoutes() {
  return <Routes>
    <Route index element={<LandingPage/>}/>

    {/* Signed-out only — an already signed-in visitor is sent on to the app. */}
    <Route path="login" element={<PublicOnlyRoute><LoginPage/></PublicOnlyRoute>}/>
    <Route path="register" element={<PublicOnlyRoute><RegisterPage/></PublicOnlyRoute>}/>
    <Route path="forgot-password" element={<PublicOnlyRoute><ForgotPasswordPage/></PublicOnlyRoute>}/>
    <Route path="reset-password" element={<PublicOnlyRoute><ResetPasswordPage/></PublicOnlyRoute>}/>

    {/* Signed in, but business setup is not finished yet. */}
    <Route path="business-setup" element={<ProtectedRoute requireBusiness={false}><BusinessSetupPage/></ProtectedRoute>}/>

    {/* Signed in with a business — the workspace. Business details live in
        Settings, so there is no separate /business page. */}
    <Route path="dashboard" element={<ProtectedRoute><AppLayout><Dashboard/></AppLayout></ProtectedRoute>}/>
    <Route path="inventory" element={<ProtectedRoute><AppLayout><Inventory/></AppLayout></ProtectedRoute>}/>
    <Route path="products" element={<ProtectedRoute><AppLayout><Products/></AppLayout></ProtectedRoute>}/>
    <Route path="suppliers" element={<ProtectedRoute><AppLayout><Suppliers/></AppLayout></ProtectedRoute>}/>
    <Route path="analytics" element={<ProtectedRoute><AppLayout><Analytics/></AppLayout></ProtectedRoute>}/>
    <Route path="ai-insights" element={<ProtectedRoute><AppLayout><AiInsights/></AppLayout></ProtectedRoute>}/>
    <Route path="reports" element={<ProtectedRoute><AppLayout><Reports/></AppLayout></ProtectedRoute>}/>
    <Route path="notifications" element={<ProtectedRoute><AppLayout><Notifications/></AppLayout></ProtectedRoute>}/>
    <Route path="settings" element={<ProtectedRoute><AppLayout><Settings/></AppLayout></ProtectedRoute>}/>
    <Route path="csv-upload" element={<ProtectedRoute><AppLayout><CsvUpload/></AppLayout></ProtectedRoute>}/>
    <Route path="admin" element={<ProtectedRoute><AppLayout><Admin/></AppLayout></ProtectedRoute>}/>

    <Route path="403" element={<ForbiddenPage/>}/>
    <Route path="500" element={<ServerErrorPage/>}/>
    <Route path="*" element={<NotFoundPage/>}/>
  </Routes>;
}
