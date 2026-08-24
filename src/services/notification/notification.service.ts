import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/notification/_base";
import {
  mapUserNotificationDetail,
  mapUserNotificationSummary,
  type RawGetUserNotificationResponse,
  type RawUserNotificationSummaryResponse,
} from "@/services/notification/notification.mappers";
import type { UserNotificationDetail, UserNotificationSummary } from "@/services/notification/notification.types";

/** Wire shape of `CursorPaginatedResult<T>` — same duplicated-per-module convention as `services/support-chat/support-chat.service.ts` and `services/content`. */
export interface CursorPaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Real Notification Service adapter (`core-backend/src/Services/Notification`) — the Notification
 * Center's REST surface only (`/user-notifications/*`). The push side (`GlobalHub.ReceiveNotification`)
 * lives in `shared/lib/realtime/notification-hub.ts` and is deliberately not merged with this:
 * the push payload (`NotificationDto`) carries no `Id`, so it can't be marked read or safely
 * spliced into this service's cached list — only a real fetch through here gives an item an id.
 * Unverified against a live response (service registered but not started locally) — same caveat
 * as `notification.mappers.ts`.
 */
export const notificationService = {
  /** `GET /user-notifications/me` — newest first, cursor-paginated, scoped server-side to the caller. */
  async listMine(params: { cursor?: string | null; limit: number }): Promise<CursorPaginatedResult<UserNotificationSummary>> {
    const response = await httpClient.get<ApiResponse<CursorPaginatedResult<RawUserNotificationSummaryResponse>>>(`${BASE_PATH}/user-notifications/me`, {
      query: { cursor: params.cursor ?? undefined, limit: params.limit },
    });
    const page = unwrapApiResponse(response);
    return { items: page.items.map(mapUserNotificationSummary), nextCursor: page.nextCursor, hasMore: page.hasMore };
  },

  /** `GET /user-notifications/{id}` — full record (adds `body`), scoped server-side to the caller's own. */
  async getById(notificationId: string): Promise<UserNotificationDetail> {
    const response = await httpClient.get<ApiResponse<RawGetUserNotificationResponse>>(`${BASE_PATH}/user-notifications/${notificationId}`);
    return mapUserNotificationDetail(unwrapApiResponse(response));
  },

  /** `POST /user-notifications/{id}/read` — no bulk "mark all as read" endpoint exists on the backend, only this per-item one. */
  async markAsRead(notificationId: string): Promise<void> {
    await httpClient.post(`${BASE_PATH}/user-notifications/${notificationId}/read`);
  },
};
