import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { env } from "@/shared/lib/env";
import { BASE_PATH } from "@/services/auth/_base";

import type { LoginResponseDto } from "@/services/auth/login";

/**
 * `POST /auth/refresh-token` — reads the RefreshToken cookie, reissues both cookies, and returns
 * the tenant's current Bootstrap Version (same `{ version }` shape `login` returns). Throws
 * (HttpError, typically 401) when there is no valid session. Only called when the server-computed
 * `InitialAuthState.needsRefresh` says so (see `authService.bootstrapSession`), not unconditionally
 * on every app load. Requires X-App-Key just like `login` (`RefreshTokenHandler` applies the same
 * Root-bypass pattern as `LoginHandler`, but nova-wcm never logs in as Root — see `login.ts`'s doc
 * comment).
 */
export async function refreshToken(): Promise<LoginResponseDto> {
  const response = await httpClient.post<ApiResponse<LoginResponseDto>>(`${BASE_PATH}/refresh-token`, undefined, {
    headers: { "X-App-Key": env.appCode },
  });
  return unwrapApiResponse(response);
}
