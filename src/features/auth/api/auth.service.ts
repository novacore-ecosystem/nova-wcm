import type { InitialAuthState } from "@novacore/frontend-next-shadcn";

import { getCurrentUser, login, logout, refreshToken, type LoginRequestDto } from "@/services/auth";
import type { LoginFormValues } from "@/features/auth/auth.schema";

export const authService = {
  async login(values: LoginFormValues, tenantClientKey?: string) {
    const request: LoginRequestDto = { email: values.email, password: values.password };
    const { version } = await login(request, { tenantClientKey });
    const user = await getCurrentUser();
    return { user, version };
  },
  async logout() {
    await logout();
  },
  /**
   * Resolves the current session, or null if none exists. Never throws.
   *
   * Only calls refresh-token when `initialAuthState.needsRefresh` says so (built server-side
   * from the request's cookies, see `(admin)/layout.tsx`) - replaces the old unconditional
   * refresh-probe that ran on every page load even when the access token cookie was already
   * valid. A true guest (neither cookie present) resolves to no session immediately, with no
   * network call. `version` is the tenant's current Bootstrap Version as of the refresh, if one
   * happened - `null` otherwise, meaning "no new information," not "Root/no tenant" (nova-wcm
   * always resolves a real tenant).
   */
  async bootstrapSession(initialAuthState: InitialAuthState) {
    if (!initialAuthState.hasAccessToken && !initialAuthState.hasRefreshToken) {
      return { user: null, version: null };
    }

    try {
      let version: number | null = null;
      if (initialAuthState.needsRefresh) {
        ({ version } = await refreshToken());
      }
      const user = await getCurrentUser();
      return { user, version };
    } catch {
      return { user: null, version: null };
    }
  },
};
