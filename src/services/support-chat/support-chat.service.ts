import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/support-chat/_base";
import {
  mapConversationDetail,
  mapConversationStatus,
  mapHandoverInvitation,
  mapMessage,
  mapQueueItem,
  type RawChatMessageDto,
  type RawConversationQueueItemDto,
  type RawGetConversationResponse,
  type RawGetConversationStatusResponse,
  type RawHandoverInvitationDto,
} from "@/services/support-chat/support-chat.mappers";
import type { ConversationDetail, ConversationReasonSuggestion, HandoverInvitation, QueueConversationItem } from "@/services/support-chat/support-chat.types";

/** Wire shape of `CursorPaginatedResult<T>` (`BuildingBlock.Application/Abstractions/Common`) — opaque, feature-local cursor strings, never converted to offset pagination. */
export interface CursorPaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

/**
 * Real Chat Service adapter (`core-backend/src/Services/Chat`) — see the 2026-08-22 audit in
 * `.wolf/memory.md` for the full endpoint/gap inventory this was built against. Deliberately
 * thin: only wraps what Chat.API actually exposes. Notable absences, all backend gaps (not
 * frontend oversights) — do not add client-side workarounds that fake these:
 *
 * - No message-history REST endpoint. The only retrieval path is `ChatHub.RecoverMessages`
 *   (SignalR, capped at 200, requires a live connection) — see `shared/lib/realtime/chat-hub.ts`.
 * - No endpoint returns Contact/customer details (name/email/phone) for a conversation. The admin
 *   UI can only show `title`/`reason` (free text) and raw ids — never a customer name.
 * - No "list conversations assigned to me" endpoint — only the queue (Waiting items only) and
 *   get-by-id exist. The Assigned tab is therefore backed by a client-side tracked id set (see
 *   `shared/stores/chat-ownership.store.ts`), not a real query — see that store's doc comment.
 * - No priority-update, AI-mode/metadata, mention/reaction-create, message-edit/recall, or
 *   create-handover-invitation endpoints. UI for these is either removed or kept local-only.
 */
export const supportChatService = {
  /** `GET /conversation-queues/items` — Waiting items only; claiming (or the item being removed) drops it from this list. */
  async getConversationQueue(params: { queueId?: string; cursor?: string | null; limit: number }): Promise<CursorPaginatedResult<QueueConversationItem>> {
    const response = await httpClient.get<ApiResponse<CursorPaginatedResult<RawConversationQueueItemDto>>>(`${BASE_PATH}/conversation-queues/items`, {
      query: { queueId: params.queueId, cursor: params.cursor ?? undefined, limit: params.limit },
    });
    const page = unwrapApiResponse(response);
    return { items: page.items.map(mapQueueItem), nextCursor: page.nextCursor, hasMore: page.hasMore };
  },

  /** `POST /conversations/{id}/claim` — 204. Marks the queue item Assigned and creates a `ConversationAssignment` for the caller. 403s if the caller is a guest. */
  async claimConversation(conversationId: string): Promise<void> {
    await httpClient.post(`${BASE_PATH}/conversations/${conversationId}/claim`);
  },

  /** `GET /conversations/{id}` + `GET /conversations/{id}/status`, merged — see `ConversationDetail`'s doc comment for why two calls. */
  async getConversationDetail(conversationId: string): Promise<ConversationDetail> {
    const [conversationResponse, statusResponse] = await Promise.all([
      httpClient.get<ApiResponse<RawGetConversationResponse>>(`${BASE_PATH}/conversations/${conversationId}`),
      httpClient.get<ApiResponse<RawGetConversationStatusResponse>>(`${BASE_PATH}/conversations/${conversationId}/status`),
    ]);
    return mapConversationDetail(unwrapApiResponse(conversationResponse), unwrapApiResponse(statusResponse));
  },

  /** `GET /conversations/{id}/status` alone — the guest-recovery / quick-check path, no full conversation fetch needed. */
  async getConversationStatus(conversationId: string) {
    const response = await httpClient.get<ApiResponse<RawGetConversationStatusResponse>>(`${BASE_PATH}/conversations/${conversationId}/status`);
    return mapConversationStatus(unwrapApiResponse(response));
  },

  /** `POST /conversations/{id}/close` — 204. Broadcasts `ConversationClosed` over `ChatHub` to the conversation's group. */
  async closeConversation(conversationId: string): Promise<void> {
    await httpClient.post(`${BASE_PATH}/conversations/${conversationId}/close`);
  },

  /**
   * `POST /conversations/{id}/messages` — the canonical send path. The created message is also
   * broadcast via `ChatHub.ReceiveMessage` to the whole group *including the sender*, so callers
   * should treat that SignalR event (not this response) as the source of truth for the message's
   * final state — this call only needs to report success/failure, see `useConversationDetailPane`.
   */
  async sendMessage(conversationId: string, content: string): Promise<{ messageId: string; sequence: number }> {
    const response = await httpClient.post<ApiResponse<{ messageId: string; sequence: number }>>(`${BASE_PATH}/conversations/${conversationId}/messages`, {
      clientMessageId: crypto.randomUUID(),
      type: 1, // MessageType.Text
      content,
      format: 1, // MessageFormat.PlainText
    });
    return unwrapApiResponse(response);
  },

  /** `GET /handovers/invitations` — pending invitations addressed to the caller. Not paginated (small per-agent inbox). */
  async listHandoverInvitations(): Promise<HandoverInvitation[]> {
    const response = await httpClient.get<ApiResponse<RawHandoverInvitationDto[]>>(`${BASE_PATH}/handovers/invitations`);
    return unwrapApiResponse(response).map(mapHandoverInvitation);
  },

  /** `POST /handovers/{id}/accept` — 204. Releases the sender's assignment (if still active) and creates a new one for the caller. */
  async acceptHandover(transferRequestId: string): Promise<void> {
    await httpClient.post(`${BASE_PATH}/handovers/${transferRequestId}/accept`);
  },

  /** `POST /handovers/{id}/reject` — 204. */
  async rejectHandover(transferRequestId: string): Promise<void> {
    await httpClient.post(`${BASE_PATH}/handovers/${transferRequestId}/reject`);
  },

  /** `GET /conversation-reason-suggestions?language=` — anonymous-allowed, localized catalog. Used to give the queue/detail views a human-readable reason label when `reason` is a suggestion code. */
  async listReasonSuggestions(language: string): Promise<ConversationReasonSuggestion[]> {
    const response = await httpClient.get<ApiResponse<{ id: string; code: string; text: string }[]>>(`${BASE_PATH}/conversation-reason-suggestions`, { query: { language } });
    return unwrapApiResponse(response);
  },
};

export type { RawChatMessageDto };
export { mapMessage };
