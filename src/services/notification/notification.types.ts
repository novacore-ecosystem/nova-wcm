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

/**
 * `UserNotificationSummaryResponse` verbatim (`GET /user-notifications/me`) — the Notification
 * Center list item. No body/content here (only `GetUserNotificationResponse` — see
 * `UserNotificationDetail` — has it); this is deliberately thin for a list row.
 */
export interface UserNotificationSummary {
  id: string;
  category: string;
  type: string;
  title: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  createdAt: string;
}

/** `GetUserNotificationResponse` verbatim (`GET /user-notifications/{id}`) — the full record, used for the detail view. */
export interface UserNotificationDetail extends UserNotificationSummary {
  userId: string;
  body: string;
  readAt?: string;
  expiredAt?: string;
  campaignId?: string;
}
