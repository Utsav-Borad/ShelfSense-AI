import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ActivityFeed, AdminBrief, AuditLogs, MaintenancePanel, PlatformAnalytics,
  PlatformHealth, RolesPanel, SupportPanel, SystemSettings,
  UserDrawer, UserManagement,
} from '../../components/admin';
import { toUsers } from '../../components/admin/fromApi';
import { getUsers } from '../../services/authService';
import '../../styles/admin.css';

const EASE = [.16, 1, .3, 1];

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState('');

  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [opened, setOpened] = useState(null);

  // The account list is the one part of this page the API can answer. It is
  // administrators-only, so a non-admin account gets a clear message instead.
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getUsers();
        if (active) setUsers(toUsers(response.data));
      } catch (failure) {
        if (active) setUserError(failure.detail || 'We could not load the account list.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  const term = query.trim().toLowerCase();
  const visible = users.filter((user) => {
    if (term && ![user.name, user.email].some((field) => field.toLowerCase().includes(term))) return false;
    if (role !== 'all' && user.role !== role) return false;
    if (status !== 'all' && user.status !== status) return false;
    return true;
  });
  const isFiltered = Boolean(term) || role !== 'all' || status !== 'all';

  // An invited account has never signed in, so there is nothing to activate or
  // deactivate — the table and drawer both disable the control for those.
  function toggleStatus(id) {
    setUsers((current) => current.map((user) => (
      user.id === id && user.status !== 'invited'
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    )));
    setOpened((current) => (current?.id === id && current.status !== 'invited'
      ? { ...current, status: current.status === 'active' ? 'inactive' : 'active' }
      : current));
  }

  function assignRole(id, nextRole) {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, role: nextRole } : user)));
    setOpened((current) => (current?.id === id ? { ...current, role: nextRole } : current));
  }

  return (
    <div className="ad">
      <AdminBrief
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
            <PlatformHealth />

            <div className="ad-columns">
              <ActivityFeed />
              <PlatformAnalytics />
            </div>

            <UserManagement
              users={visible}
              total={users.length}
              loading={loading}
              query={query}
              onQuery={setQuery}
              role={role}
              onRole={setRole}
              status={status}
              onStatus={setStatus}
              filtered={isFiltered}
              onReset={() => { setQuery(''); setRole('all'); setStatus('all'); }}
              onOpen={setOpened}
              onToggleStatus={toggleStatus}
            />

            <RolesPanel />

            <div className="ad-columns">
              <AuditLogs />
              <SystemSettings />
            </div>

            <div className="ad-columns">
              <MaintenancePanel />
              <SupportPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <UserDrawer
        user={opened}
        onRole={assignRole}
        onToggleStatus={toggleStatus}
        onClose={() => setOpened(null)}
      />
    </div>
  );
}
