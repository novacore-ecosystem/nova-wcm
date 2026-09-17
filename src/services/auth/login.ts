import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { env } from "@/shared/lib/env";
import { BASE_PATH } from "@/services/auth/_base";

/** Mirrors Auth.API's `LoginRequest(string Email, string Password)`. */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/** The tenant's current Bootstrap Version as of this login (never null for nova-wcm — every login resolves a real Tenant, unlike nova-console's Root client). */
export interface LoginResponseDto {
  version: number | null;
}

/**
 * `POST /auth/login`. Sets HTTP-only session cookies; the response body carries no token, only
 * `version` (see `LoginResponseDto`). Requires X-Tenant-Client-Key to resolve which tenant is
 * being logged into — defaults to the env-configured key, overridable when the login page's
 * tenant selector is shown (see `useTenantLoginConfiguration`). Also requires X-App-Key
 * (`env.appCode`'s doc comment) — unlike nova-console's Root console, nova-wcm has no Root-bypass
 * path, so this header is always sent, never conditionally omitted; a blank/misconfigured
 * `env.appCode` surfaces as the backend's own "missing app code" error rather than silently
 * resolving to Root behavior.
 */
export async function login(request: LoginRequestDto, options?: { tenantClientKey?: string }): Promise<LoginResponseDto> {
  const response = await httpClient.post<ApiResponse<LoginResponseDto>>(`${BASE_PATH}/login`, request, {
    headers: {
      "X-Tenant-Client-Key": options?.tenantClientKey ?? env.tenantClientKey,
      "X-App-Key": env.appCode,
    },
  });
  return unwrapApiResponse(response);
}
