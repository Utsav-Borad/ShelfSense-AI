import { useEffect, useState } from 'react';
import { toAccounts } from '../components/admin/fromApi';
import { getAdminAccounts, updateUser } from '../services/authService';

// Loads every account and saves role or access changes. Shared by the Accounts
// page and the Roles page so the two cannot drift apart.
//
// Nothing changes on screen until the API confirms it: PATCH /auth/users/:id/
// is the source of truth, and it refuses some changes — an administrator
// editing their own account, for one.
export default function useAdminAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getAdminAccounts();
        if (active) setAccounts(toAccounts(response.data));
      } catch (failure) {
        if (active) setFailed(failure.detail || 'We could not load the accounts.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  async function save(id, payload, changes) {
    setNotice('');
    try {
      await updateUser(id, payload);
      setAccounts((current) => current.map((account) => (
        account.id === id ? { ...account, ...changes } : account
      )));
      return true;
    } catch (failure) {
      setNotice(failure.detail || 'We could not update that account.');
      return false;
    }
  }

  function assignRole(id, role) {
    return save(id, { role }, { role });
  }

  function toggleStatus(id) {
    const account = accounts.find((item) => item.id === id);
    if (!account) return Promise.resolve(false);
    const next = account.status === 'active' ? 'inactive' : 'active';
    return save(id, { is_active: next === 'active' }, { status: next });
  }

  return { accounts, loading, failed, notice, assignRole, toggleStatus };
}
