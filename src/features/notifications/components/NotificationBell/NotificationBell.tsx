"use client";

import { Bell, Loader2 } from "lucide-react";
import { ErrorState, Popover, SkeletonList } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { NotificationDetailDialog } from "@/features/notifications/components/NotificationBell/NotificationDetailDialog";
import { NotificationRow } from "@/features/notifications/components/NotificationBell/NotificationRow";
import { useNotificationBell } from "@/features/notifications/components/NotificationBell/useNotificationBell";

/** Header-bar notification center — mounted once in `AdminShell` (`AdminHeader`'s `notifications` slot), so it's live for the whole admin session, same scope as the SignalR connection it rides on top of (`useRequireAuth`). */
export function NotificationBell() {
  const { t } = useAppTranslation();
  const {
    items,
    unreadCount,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
    openDetailId,
    openDetail,
    closeDetail,
    markAsRead,
    markAllAsRead,
  } = useNotificationBell();

  return (
    <>
      <Popover
        align="end"
        className="w-80 p-2"
        trigger={
          <button
            type="button"
            aria-label={t("notifications.title", "Notifications")}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 ? (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium leading-none text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : null}
          </button>
        }
      >
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="text-sm font-medium">{t("notifications.title", "Notifications")}</span>
          {unreadCount > 0 ? (
            <button type="button" onClick={markAllAsRead} className="text-xs text-primary hover:underline">
              {t("notifications.markAllRead", "Mark all read")}
            </button>
          ) : null}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <SkeletonList rows={4} />
          ) : isError ? (
            <ErrorState title={t("notifications.error", "Couldn't load notifications")} onRetry={refetch} className="p-4" />
          ) : items.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">{t("notifications.empty", "No notifications yet")}</p>
          ) : (
            <div className="flex flex-col gap-0.5">
              {items.map((item) => (
                <NotificationRow key={item.id} notification={item} onOpen={() => openDetail(item.id)} onMarkAsRead={() => markAsRead(item.id)} />
              ))}
              {hasNextPage ? (
                <div className="flex justify-center py-2">
                  {isFetchingNextPage ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : (
                    <button type="button" onClick={fetchNextPage} className="text-xs text-muted-foreground hover:text-foreground">
                      {t("notifications.loadMore", "Load more")}
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </Popover>

      <NotificationDetailDialog notificationId={openDetailId} open={openDetailId !== null} onOpenChange={(open) => !open && closeDetail()} onMarkAsRead={markAsRead} />
    </>
  );
}
