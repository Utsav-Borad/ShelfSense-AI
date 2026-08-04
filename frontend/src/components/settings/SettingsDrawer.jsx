import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useDrawer from '../../hooks/useDrawer';

const EASE = [.16, 1, .3, 1];

// One drawer serving three jobs — change password, export data, delete account
// — because they share a shape and only differ in what they ask for.
export default function SettingsDrawer({ kind, onClose, onConfirm }) {
  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });
  const [visible, setVisible] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);

  // Escape, scroll lock, focus trap and focus restore — shared by every drawer.
  const panelRef = useRef(null);
  useDrawer(Boolean(kind), onClose, panelRef);

  // Clear whatever was typed last time this drawer was opened.
  useEffect(() => {
    if (!kind) return;
    setPassword({ current: '', next: '', confirm: '' });
    setConfirmText('');
    setBusy(false);
  }, [kind]);

  const meta = {
    password: { title: 'Change password', icon: 'bi-key', eyebrow: 'Security' },
    export: { title: 'Export your data', icon: 'bi-download', eyebrow: 'Data & privacy' },
    delete: { title: 'Delete your account', icon: 'bi-trash3', eyebrow: 'Data & privacy' },
  }[kind] || {};

  const passwordsMatch = password.next.length >= 8 && password.next === password.confirm;
  const canSubmit = kind === 'password' ? passwordsMatch && password.current.length > 0
    : kind === 'delete' ? confirmText.trim().toUpperCase() === 'DELETE'
      : true;

  function submit() {
    setBusy(true);
    setTimeout(() => { onConfirm(kind); setBusy(false); onClose(); }, 900);
  }

  return (
    <AnimatePresence>
      {kind && (
        <>
          <motion.div
            className="st-drawer-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: .28 }} onClick={onClose} aria-hidden="true"
          />
          <motion.aside
            ref={panelRef}
            className="st-drawer"
            role="dialog" aria-modal="true" aria-label={meta.title}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ duration: .42, ease: EASE }}
          >
            <header className="st-drawer-head">
              <span className={`st-drawer-icon${kind === 'delete' ? ' is-danger' : ''}`}>
                <i className={`bi ${meta.icon}`} aria-hidden="true" />
              </span>
              <div>
                <p className="st-eyebrow">{meta.eyebrow}</p>
                <h3>{meta.title}</h3>
              </div>
              <button type="button" className="st-drawer-close" onClick={onClose} aria-label="Close">
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            </header>

            <div className="st-drawer-body">
              {kind === 'password' && (
                <>
                  <p className="st-drawer-lead">Choose something you haven’t used before. You’ll be signed out on other devices.</p>
                  {[['current', 'Current password'], ['next', 'New password'], ['confirm', 'Confirm new password']].map(([key, label]) => (
                    <label className="st-field" key={key}>
                      <span className="st-field-label">{label}</span>
                      <span className="st-input has-icon has-trailing">
                        <i className="bi bi-lock" aria-hidden="true" />
                        <input
                          type={visible ? 'text' : 'password'}
                          value={password[key]}
                          onChange={(e) => setPassword({ ...password, [key]: e.target.value })}
                          autoComplete={key === 'current' ? 'current-password' : 'new-password'}
                        />
                        <button type="button" className="st-input-toggle" onClick={() => setVisible(!visible)} aria-pressed={visible} aria-label={visible ? 'Hide passwords' : 'Show passwords'}>
                          <i className={`bi bi-eye${visible ? '-slash' : ''}`} aria-hidden="true" />
                        </button>
                      </span>
                    </label>
                  ))}
                  {password.next && password.next.length < 8 && (
                    <p className="st-drawer-error" role="alert"><i className="bi bi-exclamation-circle" aria-hidden="true" />Use at least 8 characters.</p>
                  )}
                  {password.confirm && password.next !== password.confirm && (
                    <p className="st-drawer-error" role="alert"><i className="bi bi-exclamation-circle" aria-hidden="true" />Passwords do not match.</p>
                  )}
                </>
              )}

              {kind === 'export' && (
                <>
                  <p className="st-drawer-lead">A single archive containing everything ShelfSense holds for your business.</p>
                  <ul className="st-drawer-list">
                    {['Products, inventory and purchase records', 'Sales history as synchronized', 'Suppliers and categories', 'Analytics metrics and AI predictions', 'Generated reports and notification history'].map((item) => (
                      <li key={item}><i className="bi bi-check-lg" aria-hidden="true" />{item}</li>
                    ))}
                  </ul>
                  <p className="st-note">
                    <i className="bi bi-info-circle" aria-hidden="true" />
                    Placeholder — nothing is generated or downloaded. Export arrives with the reports endpoint.
                  </p>
                </>
              )}

              {kind === 'delete' && (
                <>
                  <p className="st-drawer-lead">
                    This permanently removes your account, your business and every synchronized record. It cannot be undone,
                    and support cannot recover it afterwards.
                  </p>
                  <ul className="st-drawer-list is-danger">
                    {['418 products and their history', '2,140 synchronized sales records', '10 suppliers', 'All reports and AI predictions'].map((item) => (
                      <li key={item}><i className="bi bi-x-lg" aria-hidden="true" />{item}</li>
                    ))}
                  </ul>
                  <label className="st-field">
                    <span className="st-field-label">Type <b>DELETE</b> to confirm</span>
                    <span className="st-input">
                      <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="DELETE" aria-label="Type DELETE to confirm" />
                    </span>
                  </label>
                  <p className="st-note">
                    <i className="bi bi-info-circle" aria-hidden="true" />
                    Interface only — no account is deleted and no request is sent.
                  </p>
                </>
              )}
            </div>

            <footer className="st-drawer-foot">
              <button
                type="button"
                className={`st-btn ${kind === 'delete' ? 'st-btn-danger' : 'st-btn-primary'}`}
                onClick={submit}
                disabled={!canSubmit || busy}
              >
                {busy ? <><span className="st-spinner" aria-hidden="true" />Working…</> : (
                  kind === 'password' ? 'Update password' : kind === 'export' ? 'Prepare export' : 'Delete permanently'
                )}
              </button>
              <button type="button" className="st-btn st-btn-ghost" onClick={onClose}>Cancel</button>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
