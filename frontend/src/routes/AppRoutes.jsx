import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import LoadingSpinner from '../components/ui/LoadingSpinner';
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

const lazyPage = (path) => lazy(() => import(path));
 const Products = lazyPage('../pages/inventory/ProductsPage'); const Suppliers = lazyPage('../pages/inventory/SuppliersPage'); const Analytics = lazyPage('../pages/analytics/AnalyticsPage'); const AiInsights = lazyPage('../pages/ai/AiInsightsPage'); const Reports = lazyPage('../pages/reports/ReportsPage'); const Notifications = lazyPage('../pages/notifications/NotificationsPage'); const Settings = lazyPage('../pages/settings/SettingsPage'); const Business = lazyPage('../pages/settings/BusinessPage'); const Admin = lazyPage('../pages/admin/AdminPage');
// Literal paths so Vite can emit these chunks — see the note below.
const CsvUpload = lazy(() => import('../pages/inventory/CsvUploadPage'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardPage'));
const Inventory = lazy(() => import('../pages/inventory/InventoryPage'));
const render = (Page) => <Suspense fallback={<LoadingSpinner/>}><Page/></Suspense>;

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

    {/* Signed in with a business — the workspace. */}
    <Route element={<ProtectedRoute><AppLayout/></ProtectedRoute>}>
      <Route path="dashboard" element={render(Dashboard)}/><Route path="inventory" element={render(Inventory)}/><Route path="products" element={render(Products)}/><Route path="suppliers" element={render(Suppliers)}/><Route path="analytics" element={render(Analytics)}/><Route path="ai-insights" element={render(AiInsights)}/><Route path="reports" element={render(Reports)}/><Route path="notifications" element={render(Notifications)}/><Route path="settings" element={render(Settings)}/><Route path="business" element={render(Business)}/><Route path="csv-upload" element={render(CsvUpload)}/><Route path="admin" element={render(Admin)}/>
    </Route>

    <Route path="403" element={<ForbiddenPage/>}/>
    <Route path="500" element={<ServerErrorPage/>}/>
    <Route path="*" element={<NotFoundPage/>}/>
  </Routes>;
}
