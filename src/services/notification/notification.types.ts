export type NotificationPriority = "low" | "normal" | "high" | "urgent";
export type NotificationStatus = "unread" | "read" | "archived";

/**
 * `NotificationDto` (the `GlobalHub.ReceiveNotification` push payload) verbatim — see
 * `notification.mappers.ts`. No REST list/history endpoint is wired into WCM yet, so this is the
 * only shape this app knows about a notification.
 */
export interface NotificationEvent {
  userId: string;
  category: string;
  type: string;
  title: string;
  content: string;
  /** Raw JSON string as sent by the backend — no published schema for it yet, left unparsed rather than guessing a shape. */
  metadata: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  expiredAt: string;
}
