import { createContext, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext(null);
const STORAGE_KEY = 'shelfsense-theme';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEY) || 'dark');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);
  const value = useMemo(() => ({ theme, isDark: theme === 'dark', toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark'), setTheme }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
