import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AdminBrief, PlatformAnalytics, PlatformHealth } from '../../components/admin';
import { toBrief, toKpis, toSignups } from '../../components/admin/fromApi';
import ErrorState from '../../components/ui/ErrorState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getAdminOverview } from '../../services/authService';
import '../../styles/admin.css';

const EASE = [.16, 1, .3, 1];

export default function AdminOverviewPage() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState('');
  const [overview, setOverview] = useState(null);

  // Administrators only. The route guard means a `user` role should never
  // reach this page, but a 403 still lands in the error state.
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getAdminOverview();
        if (active) setOverview(response.data);
      } catch (failure) {
        if (active) setFailed(failure.detail || 'We could not load the platform summary.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  if (loading) return <div className="ad"><LoadingSpinner label="Reading the platform" /></div>;

  if (failed || !overview) {
    return (
      <div className="ad">
        <ErrorState title="We could not load the overview" description={failed} />
      </div>
    );
  }

  return (
    <div className="ad">
      <AdminBrief
        brief={toBrief(overview)}
        onReady={() => setReady(true)}
        onReview={() => document.getElementById('platform-health')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      />

      <AnimatePresence>
        {ready && (
          <motion.div
            className="ad-reveal"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, ease: EASE }}
          >
            <PlatformHealth kpis={toKpis(overview)} />
            <PlatformAnalytics signups={toSignups(overview)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
