import type { NotificationItem } from "@novacore/frontend-next-shadcn";
import type { NotificationPriority, UserNotificationDetail, UserNotificationSummary } from "@/services/notification";

/**
 * WCM's own extension of the shared `NotificationItem` shape — carries `type`/`priority`, which
 * the shared module knows nothing about, so `notificationRenderConfig` (`notificationContentRenderers.tsx`)
 * and `NotificationDetailDialog` can still branch on them (matching the original, pre-migration
 * `renderOrderNotification`'s `notification.type` check).
 */
export interface WcmNotificationItem extends NotificationItem {
  type: string;
  priority: NotificationPriority;
}

/**
 * `UserNotificationSummary` (the list endpoint's shape) has no `body` — only a per-item detail
 * fetch (`GET /user-notifications/{id}`) does. The shared `NotificationItem.description` is
 * optional for exactly this reason: a mapped list row simply has no description, and
 * `NotificationItemContent` renders nothing for it (see that component's doc comment) rather than
 * an empty div.
 */
export function toNotificationItem(notification: UserNotificationSummary | UserNotificationDetail): WcmNotificationItem {
  return {
    id: notification.id,
    title: notification.title,
    description: "body" in notification ? notification.body : undefined,
    createdAt: notification.createdAt,
    status: notification.status === "unread" ? "unread" : "read",
    category: notification.category,
    type: notification.type,
    priority: notification.priority,
  };
}
