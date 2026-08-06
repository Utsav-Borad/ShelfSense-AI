import { motion } from 'framer-motion';
import { RolesPanel, ROLES } from '../../components/admin';
import ErrorState from '../../components/ui/ErrorState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import useAdminAccounts from '../../hooks/useAdminAccounts';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin.css';

const EASE = [.16, 1, .3, 1];
const initialsOf = (name) => name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();

export default function AdminRolesPage() {
  const { user: signedIn } = useAuth();
  const { accounts, loading, failed, notice, assignRole } = useAdminAccounts();

  if (loading) return <div className="ad"><LoadingSpinner label="Reading roles" /></div>;

  if (failed) {
    return <div className="ad"><ErrorState title="We could not load roles" description={failed} /></div>;
  }

  const counts = {
    admin: accounts.filter((account) => account.role === 'admin').length,
    user: accounts.filter((account) => account.role === 'user').length,
  };

  return (
    <div className="ad">
      <RolesPanel counts={counts} />

      <section className="ad-panel" aria-label="Role assignment">
        <header className="ad-section-head">
          <div>
            <p className="ad-eyebrow">Assignment</p>
            <h2>Who holds which role</h2>
          </div>
          <span className="ad-count">{accounts.length} accounts</span>
        </header>

        {notice && (
          <p className="ad-panel-note" role="alert">
            <i className="bi bi-exclamation-triangle" aria-hidden="true" />{notice}
          </p>
        )}

        <ul className="ad-assign">
          {accounts.map((account, index) => {
            const isSelf = account.id === signedIn?.id;
            const isAdmin = account.role === 'admin';
            const nextRole = isAdmin ? 'user' : 'admin';
            const nextLabel = ROLES.find((role) => role.id === nextRole).label;

            return (
              <motion.li
                key={account.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .4, delay: Math.min(index, 12) * .04, ease: EASE }}
              >
                <span className={`ad-avatar tone-${isAdmin ? 'gold' : 'olive'}`}>{initialsOf(account.name)}</span>
                <div>
                  <strong>{account.name}</strong>
                  <small>{account.email}</small>
                </div>
                <span className={`ad-role tone-${isAdmin ? 'gold' : 'olive'}`}>
                  {isAdmin ? 'Admin' : 'Business owner'}
                </span>
                {/* An administrator cannot change their own role — the API
                    rejects it, so the button says why instead of failing. */}
                <button
                  type="button"
                  className="ad-btn ad-btn-ghost"
                  onClick={() => assignRole(account.id, nextRole)}
                  disabled={isSelf}
                  title={isSelf ? 'You cannot change your own role' : `Make ${nextLabel}`}
                >
                  <i className={`bi bi-${isAdmin ? 'arrow-down-circle' : 'arrow-up-circle'}`} aria-hidden="true" />
                  {isSelf ? 'Your account' : `Make ${nextLabel}`}
                </button>
              </motion.li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
