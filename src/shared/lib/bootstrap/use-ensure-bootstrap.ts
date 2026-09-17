"use client";

import * as React from "react";
import { shouldFetchBootstrapOnServer, type InitialAuthState } from "@novacore/frontend-next-shadcn";

import { bootstrapCoordinator, getCachedBootstrap } from "@/shared/lib/bootstrap/bootstrap-client";

/**
 * Client-side fallback for the guest/cache-miss Bootstrap fetch (Cases B/C — see
 * `shouldFetchBootstrapOnServer`'s doc comment). True SSR fetching for these cases (skipping the
 * client round-trip before first paint) isn't wired into the `(public)` content route yet — that
 * needs its own data-fetching touched, out of scope here. This still satisfies the behavioral
 * requirement on every route this app renders: a guest or a cold local cache fetches once on
 * mount; an authenticated user with a warm cache never calls the Bootstrap API.
 *
 * `initialAuthState` comes from the root layout (computed server-side from request cookies), not
 * the session store — the store only resolves once `useSessionBootstrapQuery` actually runs
 * (inside `RequireAuth`, `(admin)` routes only), so a pure guest on a `(public)` page would never
 * be classified either way if this depended on it instead.
 */
export function useEnsureBootstrap(initialAuthState: InitialAuthState): void {
  React.useEffect(() => {
    const isGuest = !initialAuthState.hasAccessToken && !initialAuthState.hasRefreshToken;
    const cached = getCachedBootstrap();

    if (shouldFetchBootstrapOnServer({ isGuest, cachedBootstrapVersion: cached?.version ?? null })) {
      void bootstrapCoordinator.refreshBootstrap();
    }
    // Intentionally mount-only — initialAuthState is a snapshot from the request that produced
    // this render; a real change only shows up on the next navigation/server render anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
