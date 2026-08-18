"use client";

import { useQuery } from "@tanstack/react-query";
import type { EntitlementStatus } from "@novacore/frontend-next-shadcn";

import { getTenantEntitledPermissionIds } from "@/services/tenant/entitlement.mock";

export const tenantEntitlementKeys = {
  all: ["tenant-entitlement"] as const,
};

export interface TenantEntitlementQueryResult {
  status: EntitlementStatus;
  entitledPermissionIds: string[] | "all";
}

/**
 * Loaded once at app bootstrap (see `src/app/providers.tsx`) and fed into
 * `<TenantEntitlementProvider>` — not refetched per Access Control page, per that provider's own
 * "don't make every Permission page independently fetch entitlement" guidance. No WCM backend
 * exists yet (docs/plan.md §15), so this wraps a mock; swapping it for a real endpoint later
 * requires no changes to any Access Control page.
 */
export function useTenantEntitlementQuery(): TenantEntitlementQueryResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: tenantEntitlementKeys.all,
    queryFn: () => getTenantEntitledPermissionIds(),
    staleTime: Infinity,
    retry: false,
  });

  if (isLoading) return { status: "loading" as EntitlementStatus, entitledPermissionIds: "all" };
  if (isError) return { status: "error" as EntitlementStatus, entitledPermissionIds: "all" };
  return { status: "ready" as EntitlementStatus, entitledPermissionIds: data ?? [] };
}
