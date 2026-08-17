import { create } from "zustand";
import type { CurrentUser } from "@/services/auth";

type SessionStatus = "unknown" | "authenticated" | "unauthenticated";

interface SessionState {
  status: SessionStatus;
  user: CurrentUser | null;
  setAuthenticated: (user: CurrentUser) => void;
  setUnauthenticated: () => void;
}

/** Stable reference for "no user yet" — a fresh `[]` literal in a selector's fallback gives `useSyncExternalStore` a new identity every render, which can trigger an infinite update loop. */
export const NO_PERMISSIONS: string[] = [];

/**
 * The one deliberate exception to "server state lives in Query, not Zustand" — written only by
 * the session bootstrap query and the login/logout mutations (features/auth/api/auth.queries.ts).
 */
export const useSessionStore = create<SessionState>((set) => ({
  status: "unknown",
  user: null,
  setAuthenticated: (user) => set({ status: "authenticated", user }),
  setUnauthenticated: () => set({ status: "unauthenticated", user: null }),
}));
