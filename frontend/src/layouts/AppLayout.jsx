import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Footer from '../components/layout/Footer';
import ErrorBoundary from '../components/ui/ErrorBoundary';

// One route transition for the whole workspace, so moving between pages feels
// like a single application rather than eleven separate ones. Keyed on the
// pathname; `mode="wait"` lets the old page leave before the new one arrives.
export default function AppLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      <Sidebar />
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
              {/* Keyed on the path so a crash on one page clears when you
                  navigate to another. */}
              <ErrorBoundary key={pathname}>{children}</ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}
