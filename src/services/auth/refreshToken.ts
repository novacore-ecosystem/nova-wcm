import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/auth/_base";

/**
 * `POST /auth/refresh-token` — reads the RefreshToken cookie, reissues both cookies. Throws
 * (HttpError, typically 401) when there is no valid session. Used both for the standard
 * refresh-on-401 flow and, at app load, to silently probe whether a session exists at all.
 */
export async function refreshToken(): Promise<void> {
  const response = await httpClient.post<ApiResponse<object>>(`${BASE_PATH}/refresh-token`);
  unwrapApiResponse(response);
}
