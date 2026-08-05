import { motion } from 'framer-motion';
import Table from '../ui/Table';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { ROLES, USER_STATUS } from './data';

const EASE = [.16, 1, .3, 1];
const initialsOf = (name) => name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();
const roleLabel = (id) => ROLES.find((role) => role.id === id)?.label || id;

export default function UserManagement({
  users, total, loading, query, onQuery, role, onRole, status, onStatus,
  onOpen, onToggleStatus, onReset, filtered,
}) {
  return (
    <section className="ad-panel" id="user-management" aria-label="User management">
      <header className="ad-section-head">
        <div>
          <p className="ad-eyebrow">User management</p>
          <h2>{total} accounts on the platform</h2>
        </div>
        <span className="ad-count">{users.length} shown</span>
      </header>

      <div className="ad-filters">
        <div className="ad-search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search name, email or business"
            aria-label="Search users"
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
          </select>
          <i className="bi bi-chevron-down" aria-hidden="true" />
        </label>

        {filtered && (
          <button type="button" className="ad-btn ad-btn-ghost" onClick={onReset}>
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="ad-skeletons" aria-busy="true" aria-label="Loading users">
          {[0, 1, 2, 3, 4].map((n) => <span className="ad-sk-row" key={n} />)}
        </div>
      ) : users.length === 0 ? (
        <div className="ad-state">
          <EmptyState icon="bi-people" title="No users match" description="Try a different search term, or clear the filters." />
        </div>
      ) : (
        <Table columns={['User', 'Role', 'Status', 'Joined', '']}>
          {users.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .35, delay: Math.min(index, 10) * .04, ease: EASE }}
            >
              <td>
                <button type="button" className="ad-user-cell" onClick={() => onOpen(user)}>
                  <span className={`ad-avatar tone-${user.role === 'admin' ? 'gold' : 'olive'}`}>{initialsOf(user.name)}</span>
                  <span>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </span>
                </button>
              </td>
              <td><span className={`ad-role tone-${user.role === 'admin' ? 'gold' : 'olive'}`}>{roleLabel(user.role)}</span></td>
              <td><Badge variant={USER_STATUS[user.status].tone}>{USER_STATUS[user.status].label}</Badge></td>
              <td className="ad-row-action">
                <button
                  type="button"
                  className={user.status === 'active' ? 'is-danger' : ''}
                  onClick={() => onToggleStatus(user.id)}
                  disabled={user.status === 'invited'}
                  title={user.status === 'invited' ? 'Invitation pending' : user.status === 'active' ? 'Deactivate' : 'Activate'}
                >
                  <i className={`bi bi-${user.status === 'active' ? 'person-dash' : 'person-check'}`} aria-hidden="true" />
                </button>
              </td>
            </motion.tr>
          ))}
        </Table>
      )}
    </section>
  );
}
