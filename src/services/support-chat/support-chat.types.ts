export type ConversationStatus = "unassigned" | "assigned" | "closed";
export type MessageSender = "customer" | "agent" | "ai" | "system";
export type ConversationPriority = "normal" | "important" | "high" | "urgent";

/**
 * AI participation state for a conversation. `holding` = AI is standing in for a human (keeping
 * the customer engaged); `humanActive` = a consultant is actively replying; `handover` = AI is
 * bridging while ownership moves between consultants. No real AI backend exists — this is state
 * modeling only, see `AiModeConfig`'s doc comment.
 */
export type AiConversationState = "disabled" | "holding" | "humanActive" | "handover";

export interface ConversationMessage {
  id: string;
  sender: MessageSender;
  senderName?: string;
  body: string;
  sentAt: string;
}

export type CustomerIdentityKind = "anonymous" | "authenticated" | "known";

/**
 * A conversation is associated with a customer identity, not a display name typed into a chat
 * box. `kind` distinguishes a landing-page visitor who just filled the onboarding form
 * ("anonymous" — the business now knows who they are, but there's no account), a logged-in
 * e-commerce customer ("authenticated" — `accountId` set, identity resolved automatically), and a
 * returning contact recognized from a prior conversation ("known" — matched by email/phone but
 * still no account). See `features/support-chat/components/customer/`.
 */
export interface CustomerIdentity {
  kind: CustomerIdentityKind;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  accountId?: string;
}

export interface HandoverRequest {
  id: string;
  fromAgentId: string;
  fromAgentName: string;
  toAgentId: string;
  toAgentName: string;
  reason?: string;
  requestedAt: string;
  status: "pending" | "accepted" | "rejected";
}

/**
 * `skills` scope what AI is allowed to answer (e.g. "General FAQ", "Shipping information").
 * `context` is free-text guidance from the consultant (e.g. "don't make refund decisions").
 * There is no real AI Service behind this — enabling holding mode only sets state, it never
 * triggers actual generation. See `docs`/task notes: "do not implement a fake AI backend."
 */
export interface AiModeConfig {
  state: AiConversationState;
  skills: string[];
  context?: string;
  enabledAt?: string;
}

/**
 * A customer conversation started from the (future) landing-page chat widget. `assignedAgentId`
 * models the pool → pick → own workflow: undefined means it's sitting in the unassigned pool, set
 * means a staff member owns it. Message history is *not* embedded here — see
 * `support-chat.service.ts`'s separate `listMessages`, cursor-paginated independently of the
 * conversation list.
 */
export interface Conversation {
  id: string;
  customer: CustomerIdentity;
  status: ConversationStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  priority: ConversationPriority;
  unreadCount: number;
  aiMode: AiModeConfig;
  pendingHandover?: HandoverRequest;
  createdAt: string;
  updatedAt: string;
  /** Denormalized for the list view only — the real message thread is fetched separately via `listMessages`, cursor-paginated independently. Kept in sync by `sendMessage`. */
  lastMessagePreview?: string;
  lastMessageSender?: MessageSender;
}

export interface SupportAgent {
  id: string;
  name: string;
}
