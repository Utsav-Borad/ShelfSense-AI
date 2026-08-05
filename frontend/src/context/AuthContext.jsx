import { createContext, useEffect, useState } from 'react';
import { getBusiness } from '../services/businessService';

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
  // True until the session has been restored *and* the business has been
  // resolved, so route guards do not bounce a signed-in owner to /login on a
  // hard refresh or to /business-setup while the business is still loading.
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // Asks the API whether this account has a business. GET /business/ answers
  // with data: null when setup is not finished, which is a normal state.
  async function loadBusiness() {
    try {
      const response = await getBusiness();
      const profile = response.data;
      if (profile) localStorage.setItem(STORAGE.business, JSON.stringify(profile));
      else localStorage.removeItem(STORAGE.business);
      setBusiness(profile);
      return profile;
    } catch {
      // The API is unreachable or rejected us. Fall back to the stored copy so
      // a brief outage does not push an existing owner back through setup.
      const stored = readStored(STORAGE.business);
      setBusiness(stored);
      return stored;
    }
  }

  // Runs once on mount to restore a previous session.
  useEffect(() => {
    async function restore() {
      const token = localStorage.getItem(STORAGE.access);
      const storedUser = readStored(STORAGE.user);
      if (token && storedUser) {
        setUser(storedUser);
        // Show the stored business immediately, then confirm it with the API.
        setBusiness(readStored(STORAGE.business));
        await loadBusiness();
      }
      setIsBootstrapping(false);
    }
    restore();
  }, []);

  // Awaited by the login page, so navigation only happens once we know whether
  // this owner still needs to complete business setup.
  async function login(account, tokens = {}) {
    if (tokens.access) localStorage.setItem(STORAGE.access, tokens.access);
    if (tokens.refresh) localStorage.setItem(STORAGE.refresh, tokens.refresh);
    localStorage.setItem(STORAGE.user, JSON.stringify(account));
    setUser(account);
    return loadBusiness();
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
