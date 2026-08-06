import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AdminSidebar from '../components/layout/AdminSidebar';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';
import ErrorBoundary from '../components/ui/ErrorBoundary';

// The same shell as AppLayout, with the admin navigation in place of the
// owner's. Topbar and Footer are shared: the account menu, theme switch and
// sign-out behave identically in both areas.
export default function AdminLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      <AdminSidebar />
      <div className="app-main">
        <Topbar />
        <main className="app-content">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              className="route-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: .26, ease: [.16, 1, .3, 1] }}
            >
              <ErrorBoundary key={pathname}>{children}</ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}
