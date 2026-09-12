import { Badge } from "@novacore/frontend-next-shadcn";
import type { NotificationRenderRegistry } from "@novacore/frontend-next-shadcn";
import type { WcmNotificationItem } from "@/features/notifications/lib/toNotificationItem";

/**
 * Illustrates branching further on `type` within one `category` (e.g. distinguishing an order
 * being created from a status change) — both fields are free text with no published catalog (see
 * `notification.mappers.ts`), so this is a presentation convention this app defines for itself,
 * not a confirmed backend contract. `notification.description` here is the fetched detail's
 * `body` — see `toNotificationItem`'s doc comment for why a list-row-context notification won't
 * have one, and `NotificationItemContent`'s `variant` for the row/detail styling split.
 */
function OrderNotificationDescription({ notification }: { notification: WcmNotificationItem }) {
  return (
    <div className="space-y-1.5">
      <Badge variant="outline" className="text-[11px] capitalize">
        {notification.type.replace(/[-_]/g, " ")}
      </Badge>
      <p className="whitespace-pre-wrap text-sm text-foreground">{notification.description}</p>
    </div>
  );
}

/**
 * Switches on `category` (lowercased); a config entry's `description` component may branch
 * further on `type` internally (see `OrderNotificationDescription`). A category with no entry here
 * — including every one this app hasn't designed a renderer for yet — falls back to
 * `NotificationItemContent`'s own default description rendering, which is the intended behavior,
 * not a gap to fill in.
 */
export const notificationRenderConfig: NotificationRenderRegistry<WcmNotificationItem> = {
  order: { description: OrderNotificationDescription },
};

export function notificationRenderKey(notification: WcmNotificationItem): string {
  return notification.category?.toLowerCase() ?? "";
}
