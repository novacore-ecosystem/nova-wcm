import type {
  ConversationDetail,
  ConversationLifecycle,
  ConversationMessage,
  ConversationPriority,
  ConversationStatus,
  ConversationType,
  HandoverInvitation,
  MessageFormat,
  MessageSenderType,
  MessageType,
  QueueConversationItem,
} from "@/services/support-chat/support-chat.types";

/**
 * Chat.API returns Chat.Domain's enums as their raw numeric ordinal (no `JsonStringEnumConverter`
 * is registered anywhere in Chat.API/BuildingBlock.Web — only `BuildingBlock.Criteria`'s
 * `CriteriaOperator` gets one). Property names arrive camelCase — ASP.NET Core minimal APIs'
 * (Carter's) default `JsonOptions`, since nothing in Chat.API overrides it. Both assumptions are
 * unverified against a live response (Chat Service isn't wired into local docker-compose /
 * gateway config yet — see STATUS.md's external-blockers section) — if wrong, this file is the
 * only place that needs fixing.
 */
const CONVERSATION_STATUS: Record<number, ConversationStatus> = { 1: "queued", 2: "open", 3: "pending", 4: "closed" };
const CONVERSATION_TYPE: Record<number, ConversationType> = { 1: "oneToOne", 2: "group" };
const CONVERSATION_LIFECYCLE: Record<number, ConversationLifecycle> = { 1: "session", 2: "persistent" };
const CONVERSATION_PRIORITY: Record<number, ConversationPriority> = { 1: "low", 2: "normal", 3: "high", 4: "urgent" };
const MESSAGE_SENDER_TYPE: Record<number, MessageSenderType> = { 1: "user", 2: "system", 3: "bot", 4: "service", 5: "ai" };
const MESSAGE_FORMAT: Record<number, MessageFormat> = { 1: "plainText", 2: "markdown" };
/** Domain has more (Poll/Task/Schedule/Structured/...) — anything unrecognized renders as "text" rather than crashing on an unknown value. */
const MESSAGE_TYPE: Record<number, MessageType> = { 1: "text", 2: "image", 3: "file", 4: "sticker", 5: "system" };

function mapEnum<T>(table: Record<number, T>, raw: number, fallback: T): T {
  return table[raw] ?? fallback;
}

export interface RawChatMessageDto {
  id: string;
  conversationId: string;
  senderUserId?: string | null;
  senderType: number;
  sequence: number;
  type: number;
  content: string;
  format: number;
  createdAt: string;
}

export function mapMessage(raw: RawChatMessageDto): ConversationMessage {
  return {
    id: raw.id,
    conversationId: raw.conversationId,
    senderUserId: raw.senderUserId ?? undefined,
    senderType: mapEnum(MESSAGE_SENDER_TYPE, raw.senderType, "user"),
    sequence: raw.sequence,
    type: mapEnum(MESSAGE_TYPE, raw.type, "text"),
    content: raw.content,
    format: mapEnum(MESSAGE_FORMAT, raw.format, "plainText"),
    createdAt: raw.createdAt,
  };
}

export interface RawConversationQueueItemDto {
  conversationId: string;
  queueId: string;
  enqueuedAt: string;
  priority: number;
  title?: string | null;
  type: number;
  conversationPriority: number;
}

export function mapQueueItem(raw: RawConversationQueueItemDto): QueueConversationItem {
  return {
    conversationId: raw.conversationId,
    queueId: raw.queueId,
    enqueuedAt: raw.enqueuedAt,
    queuePriority: raw.priority,
    title: raw.title ?? undefined,
    type: mapEnum(CONVERSATION_TYPE, raw.type, "oneToOne"),
    priority: mapEnum(CONVERSATION_PRIORITY, raw.conversationPriority, "normal"),
  };
}

export interface RawGetConversationResponse {
  id: string;
  type: number;
  lifecycle: number;
  status: number;
  title?: string | null;
  description?: string | null;
  avatar?: string | null;
  reason?: string | null;
  priority: number;
  closedAt?: string | null;
  lastActivityAt: string;
  lastMessageSequence: number;
  createdAt: string;
  updatedAt: string;
}

export interface RawGetConversationStatusResponse {
  id: string;
  status: number;
  title?: string | null;
  assignedUserId?: string | null;
  lastActivityAt: string;
}

export function mapConversationStatus(raw: RawGetConversationStatusResponse): Pick<ConversationDetail, "id" | "status" | "title" | "assignedUserId" | "lastActivityAt"> {
  return {
    id: raw.id,
    status: mapEnum(CONVERSATION_STATUS, raw.status, "queued"),
    title: raw.title ?? undefined,
    assignedUserId: raw.assignedUserId ?? undefined,
    lastActivityAt: raw.lastActivityAt,
  };
}

export function mapConversationDetail(conversation: RawGetConversationResponse, status?: RawGetConversationStatusResponse): ConversationDetail {
  return {
    id: conversation.id,
    type: mapEnum(CONVERSATION_TYPE, conversation.type, "oneToOne"),
    lifecycle: mapEnum(CONVERSATION_LIFECYCLE, conversation.lifecycle, "session"),
    status: mapEnum(CONVERSATION_STATUS, conversation.status, "queued"),
    title: conversation.title ?? undefined,
    description: conversation.description ?? undefined,
    avatar: conversation.avatar ?? undefined,
    reason: conversation.reason ?? undefined,
    priority: mapEnum(CONVERSATION_PRIORITY, conversation.priority, "normal"),
    closedAt: conversation.closedAt ?? undefined,
    lastActivityAt: conversation.lastActivityAt,
    lastMessageSequence: conversation.lastMessageSequence,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    assignedUserId: status?.assignedUserId ?? undefined,
  };
}

export interface RawHandoverInvitationDto {
  transferRequestId: string;
  conversationId: string;
  fromUserId: string;
  requestedAt: string;
}

export function mapHandoverInvitation(raw: RawHandoverInvitationDto): HandoverInvitation {
  return { transferRequestId: raw.transferRequestId, conversationId: raw.conversationId, fromUserId: raw.fromUserId, requestedAt: raw.requestedAt };
}
