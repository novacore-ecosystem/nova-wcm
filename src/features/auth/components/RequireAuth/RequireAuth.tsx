"use client";

import type { ReactNode } from "react";
import { LoadingState, type InitialAuthState } from "@novacore/frontend-next-shadcn";

import { useRequireAuth } from "@/features/auth/components/RequireAuth/useRequireAuth";

interface RequireAuthProps {
  children: ReactNode;
  /** Computed server-side from request cookies (`(admin)/layout.tsx`) — see `useSessionBootstrapQuery`'s doc comment. */
  initialAuthState: InitialAuthState;
}

/** Protects (admin) routes. */
export function RequireAuth({ children, initialAuthState }: RequireAuthProps) {
  const { isChecking, isAuthenticated } = useRequireAuth(initialAuthState);

  if (isChecking) return <LoadingState />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
