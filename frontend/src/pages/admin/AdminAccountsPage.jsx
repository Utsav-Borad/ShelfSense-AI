import { useState } from 'react';
import { AccountDrawer, AccountTable } from '../../components/admin';
import ErrorState from '../../components/ui/ErrorState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useAdminAccounts from '../../hooks/useAdminAccounts';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin.css';

export default function AdminAccountsPage() {
  const { user: signedIn } = useAuth();
  const { accounts, loading, failed, notice, assignRole, toggleStatus } = useAdminAccounts();

  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [opened, setOpened] = useState(null);

  const term = query.trim().toLowerCase();
  const visible = accounts.filter((account) => {
    const fields = [account.name, account.email, account.business?.name || ''];
    if (term && !fields.some((field) => field.toLowerCase().includes(term))) return false;
    if (role !== 'all' && account.role !== role) return false;
    // "No shop set up" is its own filter rather than a status, because it is
    // about the business, not about whether the account may sign in.
    if (status === 'no-business' && account.business) return false;
    if (status !== 'all' && status !== 'no-business' && account.status !== status) return false;
    return true;
  });

  // The drawer holds its own copy, so it has to follow a saved change too.
  const openedAccount = opened ? accounts.find((item) => item.id === opened) : null;

  if (loading) return <div className="ad"><LoadingSpinner label="Reading the accounts" /></div>;

  if (failed) {
    return <div className="ad"><ErrorState title="We could not load the accounts" description={failed} /></div>;
  }

  return (
    <div className="ad">
      <AccountTable
        accounts={visible}
        total={accounts.length}
        notice={notice}
        query={query}
        onQuery={setQuery}
        role={role}
        onRole={setRole}
        status={status}
        onStatus={setStatus}
        filtered={Boolean(term) || role !== 'all' || status !== 'all'}
        onReset={() => { setQuery(''); setRole('all'); setStatus('all'); }}
        onOpen={(account) => setOpened(account.id)}
        onToggleStatus={toggleStatus}
        currentUserId={signedIn?.id}
      />

      <AccountDrawer
        account={openedAccount}
        isSelf={openedAccount?.id === signedIn?.id}
        onRole={assignRole}
        onToggleStatus={toggleStatus}
        onClose={() => setOpened(null)}
      />
    </div>
  );
}
