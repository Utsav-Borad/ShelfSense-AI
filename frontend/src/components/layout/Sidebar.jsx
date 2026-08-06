import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../hooks/useSidebar';
import { notificationId } from '../notifications/fromApi';
import { loadReadIds, onReadStateChange } from '../notifications/readState';
import { getNotifications } from '../../services/notificationsService';

// The fourth entry marks a link only administrators may see. Admin is the one
// area that is not about the owner's own shop, and its endpoints answer a
// `user` role with 403 — showing the link would only lead to a refusal.
const navigation = [
  ['Dashboard', '/dashboard', 'bi-grid-1x2'], ['Inventory', '/inventory', 'bi-box-seam'], ['Products', '/products', 'bi-tags'], ['Suppliers', '/suppliers', 'bi-truck'],
  ['Analytics', '/analytics', 'bi-bar-chart-line'], ['AI Insights', '/ai-insights', 'bi-stars'], ['Reports', '/reports', 'bi-file-earmark-text'], ['Notifications', '/notifications', 'bi-bell'],
  ['CSV Upload', '/csv-upload', 'bi-cloud-arrow-up'], ['Settings', '/settings', 'bi-gear'], ['Admin', '/admin', 'bi-shield-check', true],
];

// The badge lives here rather than on a topbar bell — Notifications is
// already in the navigation, so one indicator in one place is enough.
export default function Sidebar() {
  // Which products currently need attention, from the notification engine. The
  // sidebar outlives every page, so this is fetched once per session; the
  // server caches the analysis, so it costs nothing to ask.
  const [alertIds, setAlertIds] = useState([]);
  // Read state is not on the server — notifications are generated fresh on
  // every request — so it is read from the same store the page writes to.
  const [readIds, setReadIds] = useState(loadReadIds);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await getNotifications();
        if (active) setAlertIds(response.data.notifications.map(notificationId));
      } catch {
        // A business with no data has nothing to flag; leave the badge off.
        if (active) setAlertIds([]);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  // Recount as soon as the notification centre marks something read, since the
  // sidebar is a sibling of the page and cannot be told through props.
  useEffect(() => onReadStateChange(() => setReadIds(loadReadIds())), []);

  const unreadCount = alertIds.filter((id) => !readIds.includes(id)).length;

  const { isAdmin } = useAuth();
  const links = navigation.filter(([, , , adminOnly]) => !adminOnly || isAdmin);

  const { collapsed, mobileOpen, setMobileOpen, toggleCollapsed } = useSidebar();
  const content = <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}><div className="sidebar-brand"><span className="brand-mark"><i className="bi bi-layers-fill"/></span>{!collapsed && <span>ShelfSense <b>AI</b></span>}<button className="icon-btn collapse-btn" onClick={toggleCollapsed} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed}><i className="bi bi-layout-sidebar-inset"/></button></div><nav className="sidebar-nav" aria-label="Primary navigation">{links.map(([label, to, icon]) => { const badge = to === '/notifications' && unreadCount > 0 ? unreadCount : 0; return <NavLink end={to === '/dashboard'} to={to} key={to} onClick={() => setMobileOpen(false)} title={collapsed ? label : undefined}><i className={`bi ${icon}`}/>{!collapsed && <span>{label}</span>}{badge > 0 && <em className="nav-badge">{badge}<span className="visually-hidden"> unread</span></em>}</NavLink>; })}</nav><div className="sidebar-footer"><span className="status-dot"/>{!collapsed && 'All systems operational'}</div></aside>;
  return <><div className="desktop-sidebar">{content}</div><AnimatePresence>{mobileOpen && <><motion.button className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} aria-label="Close navigation"/><motion.div className="mobile-sidebar" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ duration: .32, ease: [.16, 1, .3, 1] }}>{content}</motion.div></>}</AnimatePresence></>;
}
