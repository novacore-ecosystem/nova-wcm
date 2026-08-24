import type { NotificationEvent, NotificationPriority, NotificationStatus } from "@/services/notification/notification.types";

/**
 * Notification.API returns Notification.Domain's enums as their raw numeric ordinal (no
 * `JsonStringEnumConverter` registered anywhere in Notification.API/BuildingBlock.Web — same
 * absence confirmed for Chat.API, see `support-chat.mappers.ts`'s doc comment for the precedent).
 * Property names arrive camelCase (Carter's default `JsonOptions`). Unverified against a live
 * response — Notification Service *is* registered in `docker-compose.yml` and the gateway
 * (unlike Chat), but hasn't been started locally this round; if wrong, this file is the only
 * place that needs fixing.
 */
const NOTIFICATION_PRIORITY: Record<number, NotificationPriority> = { 1: "low", 2: "normal", 3: "high", 4: "urgent" };
const NOTIFICATION_STATUS: Record<number, NotificationStatus> = { 1: "unread", 2: "read", 3: "archived" };

function mapEnum<T>(table: Record<number, T>, raw: number, fallback: T): T {
  return table[raw] ?? fallback;
}

export interface RawNotificationDto {
  userId: string;
  category: string;
  type: string;
  title: string;
  content: string;
  metadata: string;
  priority: number;
  status: number;
  expiredAt: string;
}

export function mapNotification(raw: RawNotificationDto): NotificationEvent {
  return {
    userId: raw.userId,
    category: raw.category,
    type: raw.type,
    title: raw.title,
    content: raw.content,
    metadata: raw.metadata,
    priority: mapEnum(NOTIFICATION_PRIORITY, raw.priority, "normal"),
    status: mapEnum(NOTIFICATION_STATUS, raw.status, "unread"),
    expiredAt: raw.expiredAt,
  };
}
