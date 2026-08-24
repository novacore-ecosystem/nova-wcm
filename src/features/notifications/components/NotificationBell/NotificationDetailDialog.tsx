"use client";

import { useEffect } from "react";
import { Badge, Dialog, DialogContent, DialogHeader, DialogTitle, RelativeTime, type BadgeVariant } from "@novacore/frontend-next-shadcn";

import { useNotificationDetailQuery } from "@/features/notifications/api/notification.queries";
import { renderNotificationContent } from "@/features/notifications/lib/notificationContentRenderers";
import type { NotificationPriority } from "@/services/notification";

const PRIORITY_TONE: Record<NotificationPriority, BadgeVariant> = {
  urgent: "destructive",
  high: "warning",
  normal: "secondary",
  low: "outline",
};

/**
 * Auto-marks the notification read on open — a real REST fetch (unlike the SignalR push, which
 * carries no `Id`) gives a real id to mark, so opening the detail is treated the same as reading it.
 */
export function NotificationDetailDialog({
  notificationId,
  open,
  onOpenChange,
  onMarkAsRead,
}: {
  notificationId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkAsRead: (notificationId: string) => void;
}) {
  const { data: notification, isLoading } = useNotificationDetailQuery(notificationId ?? undefined);

  useEffect(() => {
    if (notification && notification.status === "unread") onMarkAsRead(notification.id);
  }, [notification, onMarkAsRead]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {isLoading || !notification ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{notification.title}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant={PRIORITY_TONE[notification.priority]} className="capitalize">
                {notification.priority}
              </Badge>
              <RelativeTime date={notification.createdAt} />
            </div>
            <div className="pt-1">{renderNotificationContent(notification)}</div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
