import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useSidebar } from '../../hooks/useSidebar';

const navigation = [
  ['Dashboard', '/dashboard', 'bi-grid-1x2'], ['Inventory', '/inventory', 'bi-box-seam'], ['Products', '/products', 'bi-tags'], ['Suppliers', '/suppliers', 'bi-truck'],
  ['Analytics', '/analytics', 'bi-bar-chart-line'], ['AI Insights', '/ai-insights', 'bi-stars'], ['Reports', '/reports', 'bi-file-earmark-text'], ['Notifications', '/notifications', 'bi-bell'],
  ['Business', '/business', 'bi-building'], ['CSV Upload', '/csv-upload', 'bi-cloud-arrow-up'], ['Settings', '/settings', 'bi-gear'], ['Admin', '/admin', 'bi-shield-check'],
];

export default function Sidebar() {
  const { collapsed, mobileOpen, setMobileOpen, toggleCollapsed } = useSidebar();
  const content = <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}><div className="sidebar-brand"><span className="brand-mark"><i className="bi bi-layers-fill"/></span>{!collapsed && <span>ShelfSense <b>AI</b></span>}<button className="icon-btn collapse-btn" onClick={toggleCollapsed} aria-label="Toggle sidebar"><i className="bi bi-layout-sidebar-inset"/></button></div><nav className="sidebar-nav" aria-label="Primary navigation">{navigation.map(([label, to, icon]) => <NavLink end={to === '/dashboard'} to={to} key={to} onClick={() => setMobileOpen(false)} title={collapsed ? label : undefined}><i className={`bi ${icon}`}/>{!collapsed && <span>{label}</span>}</NavLink>)}</nav><div className="sidebar-footer"><span className="status-dot"/>{!collapsed && 'All systems operational'}</div></aside>;
  return <><div className="desktop-sidebar">{content}</div><AnimatePresence>{mobileOpen && <><motion.button className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} aria-label="Close navigation"/><motion.div className="mobile-sidebar" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}>{content}</motion.div></>}</AnimatePresence></>;
}
