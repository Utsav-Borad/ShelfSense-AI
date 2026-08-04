import { createContext, useEffect, useState } from 'react';

// Auth state for the whole app, using only useState + useEffect + createContext.
// Read it anywhere with the useAuth() hook (useContext under the hood).
export const AuthContext = createContext(null);

// localStorage keys. `access_token` is the key services/axios.js already reads
// in its request interceptor — do not rename it without updating that file.
export const STORAGE = {
  access: 'access_token',
  refresh: 'refresh_token',
  user: 'shelfsense-user',
  business: 'shelfsense-business',
};

function readStored(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  // True until the first render has rehydrated from storage, so route guards
  // do not bounce a signed-in user to /login on a hard refresh.
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // Runs once on mount to restore a previous session.
  useEffect(() => {
    const token = localStorage.getItem(STORAGE.access);
    const storedUser = readStored(STORAGE.user);
    if (token && storedUser) {
      setUser(storedUser);
      setBusiness(readStored(STORAGE.business));
    }
    setIsBootstrapping(false);
  }, []);

  function login(account, tokens = {}) {
    if (tokens.access) localStorage.setItem(STORAGE.access, tokens.access);
    if (tokens.refresh) localStorage.setItem(STORAGE.refresh, tokens.refresh);
    localStorage.setItem(STORAGE.user, JSON.stringify(account));
    setUser(account);
  }

  function logout() {
    Object.values(STORAGE).forEach((key) => localStorage.removeItem(key));
    setUser(null);
    setBusiness(null);
  }

  function completeBusinessSetup(profile) {
    localStorage.setItem(STORAGE.business, JSON.stringify(profile));
    setBusiness(profile);
  }

  const value = {
    user,
    business,
    isAuthenticated: Boolean(user),
    hasBusiness: Boolean(business),
    isBootstrapping,
    login,
    logout,
    completeBusinessSetup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
