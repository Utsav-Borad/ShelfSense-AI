import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSidebar } from '../../hooks/useSidebar';
import { NOTIFICATIONS } from '../notifications/data';

const navigation = [
  ['Dashboard', '/dashboard', 'bi-grid-1x2'], ['Inventory', '/inventory', 'bi-box-seam'], ['Products', '/products', 'bi-tags'], ['Suppliers', '/suppliers', 'bi-truck'],
  ['Analytics', '/analytics', 'bi-bar-chart-line'], ['AI Insights', '/ai-insights', 'bi-stars'], ['Reports', '/reports', 'bi-file-earmark-text'], ['Notifications', '/notifications', 'bi-bell'],
  ['CSV Upload', '/csv-upload', 'bi-cloud-arrow-up'], ['Settings', '/settings', 'bi-gear'], ['Admin', '/admin', 'bi-shield-check'],
];

// The unread badge lives here rather than on a topbar bell — Notifications is
// already in the navigation, so one indicator in one place is enough.
const unreadCount = NOTIFICATIONS.filter((item) => !item.read && !item.archived).length;

export default function Sidebar() {
  const { collapsed, mobileOpen, setMobileOpen, toggleCollapsed } = useSidebar();
  const content = <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}><div className="sidebar-brand"><span className="brand-mark"><i className="bi bi-layers-fill"/></span>{!collapsed && <span>ShelfSense <b>AI</b></span>}<button className="icon-btn collapse-btn" onClick={toggleCollapsed} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed}><i className="bi bi-layout-sidebar-inset"/></button></div><nav className="sidebar-nav" aria-label="Primary navigation">{navigation.map(([label, to, icon]) => { const badge = to === '/notifications' && unreadCount > 0 ? unreadCount : 0; return <NavLink end={to === '/dashboard'} to={to} key={to} onClick={() => setMobileOpen(false)} title={collapsed ? label : undefined}><i className={`bi ${icon}`}/>{!collapsed && <span>{label}</span>}{badge > 0 && <em className="nav-badge">{badge}<span className="visually-hidden"> unread</span></em>}</NavLink>; })}</nav><div className="sidebar-footer"><span className="status-dot"/>{!collapsed && 'All systems operational'}</div></aside>;
  return <><div className="desktop-sidebar">{content}</div><AnimatePresence>{mobileOpen && <><motion.button className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} aria-label="Close navigation"/><motion.div className="mobile-sidebar" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ duration: .32, ease: [.16, 1, .3, 1] }}>{content}</motion.div></>}</AnimatePresence></>;
}
