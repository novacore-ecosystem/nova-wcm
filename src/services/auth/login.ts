import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { env } from "@/shared/lib/env";
import { BASE_PATH } from "@/services/auth/_base";

/** Mirrors Auth.API's `LoginRequest(string Email, string Password)`. */
export interface LoginRequestDto {
  email: string;
  password: string;
}

/**
 * `POST /auth/login`. Sets HTTP-only session cookies; the response body carries no token.
 * Requires X-Tenant-Client-Key to resolve which tenant is being logged into — defaults to the
 * env-configured key, overridable when the login page's tenant selector is shown (see
 * `useTenantLoginConfiguration`).
 */
export async function login(request: LoginRequestDto, options?: { tenantClientKey?: string }): Promise<void> {
  const response = await httpClient.post<ApiResponse<object>>(`${BASE_PATH}/login`, request, {
    headers: { "X-Tenant-Client-Key": options?.tenantClientKey ?? env.tenantClientKey },
  });
  unwrapApiResponse(response);
}
