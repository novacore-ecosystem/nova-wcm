"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useSessionBootstrapQuery } from "@/features/auth/api/auth.queries";
import { useSessionStore } from "@/shared/stores/session.store";

export function useRequireAuth() {
  const router = useRouter();
  const { isLoading } = useSessionBootstrapQuery();
  const status = useSessionStore((state) => state.status);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  return {
    isChecking: isLoading || status === "unknown",
    isAuthenticated: status === "authenticated",
  };
}
