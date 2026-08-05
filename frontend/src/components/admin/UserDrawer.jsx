import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useDrawer from '../../hooks/useDrawer';
import { ROLES, USER_STATUS } from './data';

const EASE = [.16, 1, .3, 1];
const initialsOf = (name) => name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();

export default function UserDrawer({ user, onRole, onToggleStatus, onClose }) {
  // Escape, scroll lock, focus trap and focus restore — shared by every drawer.
  const panelRef = useRef(null);
  useDrawer(Boolean(user), onClose, panelRef);

  const status = user ? USER_STATUS[user.status] : null;
  const currentRole = user ? ROLES.find((role) => role.id === user.role) : null;

  return (
    <AnimatePresence>
      {user && (
        <>
          <motion.div
            className="ad-drawer-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: .28 }} onClick={onClose} aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            className="ad-drawer"
            role="dialog" aria-modal="true" aria-label={`${user.name} profile`}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: .42, ease: EASE }}
          >
            <header className="ad-drawer-head">
              <span className={`ad-avatar is-lg tone-${user.role === 'admin' ? 'gold' : 'olive'}`}>{initialsOf(user.name)}</span>
              <div>
                <span className={`ad-status-tag tone-${status.tone}`}>{status.label}</span>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </div>
              <button type="button" className="ad-drawer-close" onClick={onClose} aria-label="Close profile">
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </header>

            <div className="ad-drawer-body">
              <div className="ad-drawer-stats">
                <div><small>Role</small><strong>{user.role}</strong></div>
                <div><small>Joined</small><strong>{user.joined}</strong></div>
              </div>

              <dl className="ad-drawer-rows">
                {[
                  ['Role', currentRole?.label],
                  ['Status', status.label],
                  ['Joined', user.joined],
                ].map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>

              <section className="ad-drawer-block">
                <h4><i className="bi bi-shield-lock" aria-hidden="true" />Role assignment</h4>
                <div className="ad-role-picker" role="radiogroup" aria-label="Assign role">
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      role="radio"
                      aria-checked={user.role === role.id}
                      className={`ad-role-option${user.role === role.id ? ' is-active' : ''}`}
                      onClick={() => onRole(user.id, role.id)}
                    >
                      <span className={`ad-role-mark tone-${role.tone}`}>
                        <i className={`bi bi-${user.role === role.id ? 'check-lg' : 'circle'}`} aria-hidden="true" />
                      </span>
                      <span>
                        <strong>{role.label}</strong>
                        <small>{role.description}</small>
                      </span>
                    </button>
                  ))}
                </div>
                <p className="ad-drawer-note">
                  <i className="bi bi-info-circle" aria-hidden="true" />
                  These are the only two roles the backend User model stores. Changes here are local to this session.
                </p>
              </section>
            </div>

            <footer className="ad-drawer-foot">
              <button
                type="button"
                className={`ad-btn ${user.status === 'active' ? 'ad-btn-danger' : 'ad-btn-primary'}`}
                onClick={() => { onToggleStatus(user.id); onClose(); }}
                disabled={user.status === 'invited'}
              >
                <i className={`bi bi-${user.status === 'active' ? 'person-dash' : 'person-check'}`} aria-hidden="true" />
                {user.status === 'active' ? 'Deactivate account' : 'Activate account'}
              </button>
              <button type="button" className="ad-btn ad-btn-ghost" onClick={onClose}>Close</button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
