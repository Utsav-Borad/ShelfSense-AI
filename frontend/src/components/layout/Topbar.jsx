import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../hooks/useTheme';
import { useSidebar } from '../../hooks/useSidebar';
import { useAuth } from '../../hooks/useAuth';
import { STORAGE } from '../../context/AuthContext';
import { logout as logoutRequest } from '../../services/authService';
import SearchBar from '../ui/SearchBar';

const initialsOf = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || 'SS';

export default function Topbar() {
  const { isDark, toggleTheme } = useTheme(); const { setMobileOpen } = useSidebar(); const { user, logout } = useAuth(); const navigate = useNavigate();
  const [query, setQuery] = useState(''); const [profileOpen, setProfileOpen] = useState(false); const [loggingOut, setLoggingOut] = useState(false);

  // Blacklist the refresh token server-side, then clear the local session. If
  // that call fails we still log out locally — the user asked to leave.
  async function handleLogout() {
    setLoggingOut(true);
    try { await logoutRequest(localStorage.getItem(STORAGE.refresh)); } catch { /* clear locally regardless */ }
    logout();
    navigate('/login', { replace: true });
  }

  return <header className="topbar"><button className="icon-btn mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><i className="bi bi-list"/></button><SearchBar value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search workspace"/><div className="topbar-actions"><button className="icon-btn" onClick={toggleTheme} aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}><i className={`bi bi-${isDark ? 'sun' : 'moon-stars'}`}/></button><button className="icon-btn notification-button" aria-label="Notifications"><i className="bi bi-bell"/><span/></button><div className="profile-wrap"><button className="profile-button" onClick={() => setProfileOpen(!profileOpen)} aria-expanded={profileOpen}><span>{initialsOf(user?.full_name)}</span><i className="bi bi-chevron-down"/></button>{profileOpen && <div className="profile-menu"><strong>{user?.full_name || 'ShelfSense workspace'}</strong>{user?.email && <small className="profile-email">{user.email}</small>}<button>Account settings</button><button className="profile-logout" onClick={handleLogout} disabled={loggingOut}><i className="bi bi-box-arrow-right"/>{loggingOut ? 'Logging out…' : 'Log out'}</button></div>}</div></div></header>;
}
