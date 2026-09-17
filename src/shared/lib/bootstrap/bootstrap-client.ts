import {
  BootstrapEndpoints,
  createBootstrapRefreshCoordinator,
  type TenantBootstrapResponse,
} from "@novacore/frontend-foundation";
import { createLocalStorageBootstrapStorage, writeBootstrapVersionCookie } from "@novacore/frontend-next-shadcn";

import { httpClient } from "@/shared/lib/api/client";
import { env } from "@/shared/lib/env";

const bootstrapStorage = createLocalStorageBootstrapStorage<TenantBootstrapResponse>("novacore-wcm.bootstrap");

/**
 * The one Bootstrap sync point for this app — every trigger (a successful login/refresh's
 * `version` field, a `BootstrapVersionChanged` SignalR push, a cold-cache-miss client fetch)
 * calls `bootstrapCoordinator.refreshBootstrap(...)`, never the raw endpoint directly. See
 * `BootstrapRefreshCoordinator`'s doc comment (`@novacore/frontend-foundation`).
 */
export const bootstrapCoordinator = createBootstrapRefreshCoordinator<TenantBootstrapResponse>({
  storage: bootstrapStorage,
  fetchBootstrap: () =>
    httpClient.execute(BootstrapEndpoints.get, undefined, {
      headers: { "X-Tenant-Client-Key": env.tenantClientKey },
    }),
});

// Mirrors every persisted Bootstrap's version into the small SSR-visible marker cookie, so a
// server request can tell "local cache exists" without seeing localStorage — see
// `shouldFetchBootstrapOnServer` (`@novacore/frontend-next-shadcn`).
bootstrapCoordinator.onRefreshed((bootstrap) => writeBootstrapVersionCookie(bootstrap.version));

export function getCachedBootstrap(): TenantBootstrapResponse | null {
  return bootstrapStorage.get();
}
