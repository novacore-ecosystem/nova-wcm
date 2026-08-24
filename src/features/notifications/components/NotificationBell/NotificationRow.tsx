"use client";

import { Check } from "lucide-react";
import { Button, RelativeTime, cn } from "@novacore/frontend-next-shadcn";

import { notificationCategoryIcon } from "@/features/notifications/lib/notificationCategoryIcon";
import type { UserNotificationSummary } from "@/services/notification";

export function NotificationRow({
  notification,
  onOpen,
  onMarkAsRead,
}: {
  notification: UserNotificationSummary;
  onOpen: () => void;
  onMarkAsRead: () => void;
}) {
  const Icon = notificationCategoryIcon(notification.category);
  const isUnread = notification.status === "unread";

  return (
    <div className={cn("flex items-start gap-2.5 rounded-md p-2 text-sm hover:bg-accent", isUnread && "bg-accent/40")}>
      <button type="button" onClick={onOpen} className="flex min-w-0 flex-1 items-start gap-2.5 text-left">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className="size-3.5 text-muted-foreground" />
        </span>
        <span className="min-w-0 flex-1 space-y-0.5">
          <span className={cn("block truncate", isUnread && "font-medium")}>{notification.title}</span>
          <span className="block text-xs text-muted-foreground">
            <RelativeTime date={notification.createdAt} />
          </span>
        </span>
      </button>
      {isUnread ? (
        <Button type="button" variant="ghost" size="icon" className="size-7 shrink-0" aria-label="Mark as read" onClick={onMarkAsRead}>
          <Check className="size-3.5" />
        </Button>
      ) : null}
    </div>
  );
}
