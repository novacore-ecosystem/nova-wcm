import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/auth/_base";

/** `POST /auth/logout` — revokes the refresh token and clears session cookies. */
export async function logout(): Promise<void> {
  const response = await httpClient.post<ApiResponse<object>>(`${BASE_PATH}/logout`);
  unwrapApiResponse(response);
}
