import { createContext, useCallback, useMemo, useState } from 'react';

export const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleCollapsed = useCallback(() => setCollapsed((value) => !value), []);
  const value = useMemo(() => ({ collapsed, mobileOpen, toggleCollapsed, setMobileOpen }), [collapsed, mobileOpen, toggleCollapsed]);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}
