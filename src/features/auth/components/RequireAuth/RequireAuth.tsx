"use client";

import type { ReactNode } from "react";
import { LoadingState } from "@novacore/frontend-next-shadcn";

import { useRequireAuth } from "@/features/auth/components/RequireAuth/useRequireAuth";

/** Protects (admin) routes. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isChecking, isAuthenticated } = useRequireAuth();

  if (isChecking) return <LoadingState />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
