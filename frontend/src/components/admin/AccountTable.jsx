import { motion } from 'framer-motion';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { ROLES, USER_STATUS } from './data';

const EASE = [.16, 1, .3, 1];
const initialsOf = (name) => name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();
const roleLabel = (id) => ROLES.find((role) => role.id === id)?.label || id;

export default function AccountTable({
  accounts, total, query, onQuery, role, onRole, status, onStatus,
  onOpen, onToggleStatus, onReset, filtered, notice, currentUserId,
}) {
  return (
    <section className="ad-panel" id="accounts" aria-label="Accounts">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">Accounts</p>
          <h2>{total} accounts on the platform</h2>
        </div>
        <span className="ad-count">{accounts.length} shown</span>
      </header>

      {notice && (
        <p className="ad-panel-note" role="alert">
          <i className="bi bi-exclamation-triangle" aria-hidden="true" />{notice}
        </p>
      )}

      <div className="ad-filters">
        <div className="ad-search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search name, email or shop"
            aria-label="Search accounts"
          />
          {query && (
            <button type="button" onClick={() => onQuery('')} aria-label="Clear search">
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>
          )}
        </div>

        <label className="ad-select">
          <span className="visually-hidden">Filter by role</span>
          <select value={role} onChange={(event) => onRole(event.target.value)}>
            <option value="all">All roles</option>
            {ROLES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
          <i className="bi bi-chevron-down" aria-hidden="true" />
        </label>

        <label className="ad-select">
          <span className="visually-hidden">Filter by status</span>
          <select value={status} onChange={(event) => onStatus(event.target.value)}>
            <option value="all">All statuses</option>
            {Object.entries(USER_STATUS).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}
            <option value="no-business">No shop set up</option>
          </select>
          <i className="bi bi-chevron-down" aria-hidden="true" />
        </label>

        {filtered && (
          <button type="button" className="ad-btn ad-btn-ghost" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />Clear
          </button>
        )}
      </div>

      {accounts.length === 0 ? (
        <div className="ad-state">
          <EmptyState icon="bi-people" title="No accounts match" description="Try a different search term, or clear the filters." />
        </div>
      ) : (
        <Table columns={['Account', 'Role', 'Shop', 'Status', 'Last seen', '']}>
          {accounts.map((account, index) => {
            // The API refuses to let an administrator change their own role or
            // access, so the control is disabled rather than left to fail.
            const isSelf = account.id === currentUserId;
            return (
              <motion.tr
                key={account.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: .35, delay: Math.min(index, 10) * .04, ease: EASE }}
              >
                <td>
                  <button type="button" className="ad-user-cell" onClick={() => onOpen(account)}>
                    <span className={`ad-avatar tone-${account.role === 'admin' ? 'gold' : 'olive'}`}>{initialsOf(account.name)}</span>
                    <span>
                      <strong>{account.name}</strong>
                      <small>{account.email}</small>
                    </span>
                  </button>
                </td>
                <td><span className={`ad-role tone-${account.role === 'admin' ? 'gold' : 'olive'}`}>{roleLabel(account.role)}</span></td>
                <td>
                  {account.business ? (
                    <span className="ad-shop-cell">
                      <strong>{account.business.name}</strong>
                      <small>{account.business.products} products · {account.business.revenueLabel}</small>
                    </span>
                  ) : <span className="ad-none">No shop yet</span>}
                </td>
                <td><Badge variant={USER_STATUS[account.status].tone}>{USER_STATUS[account.status].label}</Badge></td>
                <td>{account.lastSeen}</td>
                <td className="ad-row-action">
                  <button
                    type="button"
                    className={account.status === 'active' ? 'is-danger' : ''}
                    onClick={() => onToggleStatus(account.id)}
                    disabled={isSelf}
                    title={isSelf ? 'You cannot change your own access' : account.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    <i className={`bi bi-${account.status === 'active' ? 'person-dash' : 'person-check'}`} aria-hidden="true" />
                  </button>
                </td>
              </motion.tr>
            );
          })}
        </Table>
      )}
    </section>
  );
}
