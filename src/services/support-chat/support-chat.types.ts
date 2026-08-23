/**
 * Mirrors Chat.Domain's enums verbatim (see Chat.Domain/Enums). Numeric values match the C#
 * `byte` enum ordinals — the wire format is the number, these string unions are this app's own
 * display-friendly mapping (see `support-chat.mappers.ts`).
 */
export type ConversationStatus = "queued" | "open" | "pending" | "closed";
export type ConversationType = "oneToOne" | "group";
export type ConversationLifecycle = "session" | "persistent";
export type ConversationPriority = "low" | "normal" | "high" | "urgent";

export type MessageSenderType = "user" | "system" | "bot" | "service" | "ai";
export type MessageFormat = "plainText" | "markdown";

/** `Message.Type` has more values in the domain (Poll/Task/Schedule/Structured/...) — only the ones this UI actually renders are modeled; anything else falls back to a generic text render. */
export type MessageType = "text" | "image" | "file" | "sticker" | "system";

/**
 * `ChatMessageDto` verbatim (both the SignalR push payload and `ChatHub.RecoverMessages`' item
 * shape — there is no REST list-messages endpoint, see `support-chat.service.ts`'s doc comment).
 */
export interface ConversationMessage {
  id: string;
  conversationId: string;
  senderUserId?: string;
  senderType: MessageSenderType;
  sequence: number;
  type: MessageType;
  content: string;
  format: MessageFormat;
  createdAt: string;
}

/**
 * `ConversationQueueItemDto` verbatim — the *only* field set the Unassigned tab has to work
 * with. No customer/contact name, email, or avatar is available here (see the module's README-
 * equivalent doc comment on `support-chat.service.ts` for why: Chat Service has no endpoint that
 * returns Contact details for a conversation).
 */
export interface QueueConversationItem {
  conversationId: string;
  queueId: string;
  enqueuedAt: string;
  queuePriority: number;
  title?: string;
  type: ConversationType;
  priority: ConversationPriority;
}

/**
 * Composed client-side from `GetConversationResponse` (id/type/lifecycle/status/title/
 * description/avatar/reason/priority/timestamps) + `GetConversationStatusResponse`
 * (`assignedUserId` — the *only* endpoint that exposes it). Two round trips because the backend
 * splits them; see `supportChatService.getConversationDetail`.
 */
export interface ConversationDetail {
  id: string;
  type: ConversationType;
  lifecycle: ConversationLifecycle;
  status: ConversationStatus;
  title?: string;
  description?: string;
  avatar?: string;
  reason?: string;
  priority: ConversationPriority;
  closedAt?: string;
  lastActivityAt: string;
  lastMessageSequence: number;
  createdAt: string;
  updatedAt: string;
  /** From `GetConversationStatusResponse` only — undefined until that call resolves. */
  assignedUserId?: string;
}

/** `HandoverInvitationDto` verbatim. No `fromAgentName`/reason field exists on the wire — Chat Service has no user directory and `ConversationTransferRequest` carries no note field. */
export interface HandoverInvitation {
  transferRequestId: string;
  conversationId: string;
  fromUserId: string;
  requestedAt: string;
}

export interface ConversationReasonSuggestion {
  id: string;
  code: string;
  text: string;
}

/**
 * AI holding-mode scaffolding — UI-only, ephemeral (component state, not persisted). Chat
 * Service has no endpoint to read/write conversation metadata, so unlike the rest of this file
 * this has no backend counterpart at all; it resets on page reload. Kept for AI-readiness
 * parity with the rest of the app (see `features/article`'s equivalent scaffolding) — enabling
 * it only sets local state, it never triggers real generation.
 */
export type AiConversationState = "disabled" | "holding" | "humanActive" | "handover";

export interface AiModeConfig {
  state: AiConversationState;
  skills: string[];
  context?: string;
  enabledAt?: string;
}

export type ConversationListTab = "unassigned" | "assigned";
