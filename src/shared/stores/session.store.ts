import { create } from "zustand";
import type { CurrentUser } from "@/services/auth";

type SessionStatus = "unknown" | "authenticated" | "unauthenticated";

interface SessionState {
  status: SessionStatus;
  user: CurrentUser | null;
  setAuthenticated: (user: CurrentUser) => void;
  setUnauthenticated: () => void;
}

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
