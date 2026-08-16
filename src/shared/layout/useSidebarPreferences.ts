"use client";

import { usePersistentState } from "@novacore/frontend-next-shadcn";

export interface SidebarPreferences {
  collapsed: boolean;
  /** Keyed by stable navigation group id (see `navigation.tsx`) — never a translated label. */
  openGroups: Record<string, boolean>;
}

const STORAGE_KEY = "novacore.wcm.preferences.sidebar";
const DEFAULT_PREFERENCES: SidebarPreferences = { collapsed: false, openGroups: { catalog: true, content: true, website: true } };

/** Sidebar-collapsed and per-group-open state, persisted to `localStorage`. */
export function useSidebarPreferences() {
  const [preferences, setPreferences] = usePersistentState<SidebarPreferences>(STORAGE_KEY, DEFAULT_PREFERENCES);

  return {
    collapsed: preferences.collapsed,
    setCollapsed: (collapsed: boolean) => setPreferences((prev) => ({ ...prev, collapsed })),
    openGroupIds: preferences.openGroups,
    setGroupOpen: (groupId: string, open: boolean) =>
      setPreferences((prev) => ({ ...prev, openGroups: { ...prev.openGroups, [groupId]: open } })),
  };
}
