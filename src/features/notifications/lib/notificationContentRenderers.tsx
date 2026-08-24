import type { ReactNode } from "react";
import { Badge } from "@novacore/frontend-next-shadcn";

import type { UserNotificationDetail } from "@/services/notification";

export type NotificationContentRenderer = (notification: UserNotificationDetail) => ReactNode;

function defaultNotificationRenderer(notification: UserNotificationDetail): ReactNode {
  return <p className="whitespace-pre-wrap text-sm text-foreground">{notification.body}</p>;
}

/**
 * Illustrates branching further on `type` within one `category` (e.g. distinguishing an order
 * being created from a status change) — both fields are free text with no published catalog (see
 * `notification.mappers.ts`), so this is a presentation convention this app defines for itself,
 * not a confirmed backend contract.
 */
function renderOrderNotification(notification: UserNotificationDetail): ReactNode {
  return (
    <div className="space-y-1.5">
      <Badge variant="outline" className="text-[11px] capitalize">
        {notification.type.replace(/[-_]/g, " ")}
      </Badge>
      <p className="whitespace-pre-wrap text-sm text-foreground">{notification.body}</p>
    </div>
  );
}

function renderSystemNotification(notification: UserNotificationDetail): ReactNode {
  return <p className="whitespace-pre-wrap text-sm text-muted-foreground">{notification.body}</p>;
}

const RENDERERS: Record<string, NotificationContentRenderer> = {
  order: renderOrderNotification,
  system: renderSystemNotification,
};

/**
 * Switches on `category` (lowercased); a renderer may branch further on `type` internally (see
 * `renderOrderNotification`). Unrecognized categories — including every one this app hasn't
 * designed a renderer for yet — resolve to `defaultNotificationRenderer`, which is the intended
 * behavior here, not a gap to fill in.
 */
export function renderNotificationContent(notification: UserNotificationDetail): ReactNode {
  const renderer = RENDERERS[notification.category.toLowerCase()] ?? defaultNotificationRenderer;
  return renderer(notification);
}
