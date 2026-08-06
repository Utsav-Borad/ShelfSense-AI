import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useDrawer from '../../hooks/useDrawer';
import { ROLES, USER_STATUS } from './data';

const EASE = [.16, 1, .3, 1];
const initialsOf = (name) => name.split(' ').slice(0, 2).map((word) => word[0]).join('').toUpperCase();

// Everything the platform knows about one account: who they are, the shop they
// run, what that shop holds, and the two things an administrator may change.
//
// `isSelf` marks the signed-in administrator's own row — the API rejects an
// administrator changing their own role or access, so the controls are
// disabled here rather than offered and then refused.
export default function AccountDrawer({ account, isSelf, onRole, onToggleStatus, onClose }) {
  const panelRef = useRef(null);
  useDrawer(Boolean(account), onClose, panelRef);

  const status = account ? USER_STATUS[account.status] : null;
  const shop = account?.business;

  return (
    <AnimatePresence>
      {account && (
        <>
          <motion.div
            className="ad-drawer-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: .28 }} onClick={onClose} aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            className="ad-drawer"
            role="dialog" aria-modal="true" aria-label={`${account.name} account`}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: .42, ease: EASE }}
          >
            <header className="ad-drawer-head">
              <span className={`ad-avatar is-lg tone-${account.role === 'admin' ? 'gold' : 'olive'}`}>{initialsOf(account.name)}</span>
              <div>
                <span className={`ad-status-tag tone-${status.tone}`}>{status.label}</span>
                <h3>{account.name}</h3>
                <p>{account.email}</p>
              </div>
              <button type="button" className="ad-drawer-close" onClick={onClose} aria-label="Close account">
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </header>

            <div className="ad-drawer-body">
              <div className="ad-drawer-stats">
                <div><small>Joined</small><strong>{account.joined}</strong></div>
                <div><small>Last signed in</small><strong>{account.lastSeen}</strong></div>
              </div>

              {!account.hasSignedIn && (
                <p className="ad-panel-note">
                  <i className="bi bi-info-circle" aria-hidden="true" />
                  This account has never signed in since it was created.
                </p>
              )}

              <section className="ad-drawer-block">
                <h4><i className="bi bi-shop" aria-hidden="true" />Business</h4>
                {shop ? (
                  <>
                    <dl className="ad-drawer-rows">
                      {[
                        ['Shop name', shop.name],
                        ['Type', shop.type],
                        ['Address', shop.address],
                        ['Contact', shop.phone],
                        ['GST number', shop.gst],
                        ['Set up on', shop.created],
                      ].map(([label, value]) => (
                        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                      ))}
                    </dl>

                    <div className="ad-shop-stats">
                      {[
                        ['Products', shop.products],
                        ['Suppliers', shop.suppliers],
                        ['Categories', shop.categories],
                        ['Sales rows', shop.salesRecords.toLocaleString('en-IN')],
                        ['Revenue', shop.revenueLabel],
                        ['Latest sale', shop.lastSale],
                      ].map(([label, value]) => (
                        <div key={label}><strong>{value}</strong><small>{label}</small></div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="ad-none">
                    This account has not finished business setup, so it holds no products,
                    suppliers or sales yet.
                  </p>
                )}
              </section>

              <section className="ad-drawer-block">
                <h4><i className="bi bi-shield-lock" aria-hidden="true" />Role assignment</h4>
                <div className="ad-role-picker" role="radiogroup" aria-label="Assign role">
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      role="radio"
                      aria-checked={account.role === role.id}
                      className={`ad-role-option${account.role === role.id ? ' is-active' : ''}`}
                      onClick={() => onRole(account.id, role.id)}
                      disabled={isSelf || account.role === role.id}
                    >
                      <span className={`ad-role-mark tone-${role.tone}`}>
                        <i className={`bi bi-${account.role === role.id ? 'check-lg' : 'circle'}`} aria-hidden="true" />
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
                  {isSelf
                    ? 'This is your own account. An administrator cannot change their own role or access.'
                    : 'These are the only two roles the User model stores. Choosing one saves immediately.'}
                </p>
              </section>
            </div>

            <footer className="ad-drawer-foot">
              <button
                type="button"
                className={`ad-btn ${account.status === 'active' ? 'ad-btn-danger' : 'ad-btn-primary'}`}
                onClick={() => { onToggleStatus(account.id); onClose(); }}
                disabled={isSelf}
              >
                <i className={`bi bi-${account.status === 'active' ? 'person-dash' : 'person-check'}`} aria-hidden="true" />
                {account.status === 'active' ? 'Deactivate account' : 'Activate account'}
              </button>
              <button type="button" className="ad-btn ad-btn-ghost" onClick={onClose}>Close</button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
