import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSidebar } from '../../hooks/useSidebar';

// The admin console has its own navigation. It is a different job from running
// a shop — nothing here is scoped to one business — so reusing the owner's
// sidebar would only offer pages that do not apply.
const navigation = [
  ['Overview', '/admin', 'bi-speedometer2'],
  ['Accounts', '/admin/accounts', 'bi-people'],
  ['Businesses', '/admin/businesses', 'bi-shop'],
  ['Roles & access', '/admin/roles', 'bi-shield-lock'],
];

export default function AdminSidebar() {
  const { collapsed, mobileOpen, setMobileOpen, toggleCollapsed } = useSidebar();

  const content = (
    <aside className={`sidebar is-admin ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <span className="brand-mark is-admin"><i className="bi bi-shield-lock-fill" /></span>
        {!collapsed && <span>ShelfSense <b>Admin</b></span>}
        <button
          className="icon-btn collapse-btn"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!collapsed}
        >
          <i className="bi bi-layout-sidebar-inset" />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Admin navigation">
        {navigation.map(([label, to, icon]) => (
          // `end` on /admin only, so Overview does not stay lit on every child.
          <NavLink
            end={to === '/admin'}
            to={to}
            key={to}
            onClick={() => setMobileOpen(false)}
            title={collapsed ? label : undefined}
          >
            <i className={`bi ${icon}`} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* An administrator may also run a shop of their own, and needs a way
          back to it that is not the browser's back button. */}
      <div className="sidebar-return">
        <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} title={collapsed ? 'Back to workspace' : undefined}>
          <i className="bi bi-arrow-left" />
          {!collapsed && <span>Back to workspace</span>}
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <span className="status-dot is-admin" />
        {!collapsed && 'Platform administration'}
      </div>
    </aside>
  );

  return (
    <>
      <div className="desktop-sidebar">{content}</div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              className="drawer-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} aria-label="Close navigation"
            />
            <motion.div
              className="mobile-sidebar"
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ duration: .32, ease: [.16, 1, .3, 1] }}
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
