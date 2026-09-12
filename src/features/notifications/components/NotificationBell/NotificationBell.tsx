"use client";

import { NotificationBell as SharedNotificationBell } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { NotificationDetailDialog } from "@/features/notifications/components/NotificationBell/NotificationDetailDialog";
import { useNotificationBell } from "@/features/notifications/components/NotificationBell/useNotificationBell";
import { notificationCategoryIcon } from "@/features/notifications/lib/notificationCategoryIcon";
import { notificationRenderConfig, notificationRenderKey } from "@/features/notifications/lib/notificationContentRenderers";
import { toNotificationItem, type WcmNotificationItem } from "@/features/notifications/lib/toNotificationItem";

/**
 * Header-bar notification center — mounted once in `AdminShell` (`AdminHeader`'s `notifications`
 * slot). Built on the shared `NotificationBell` (`@novacore/frontend-next-shadcn`, Drawer/Sheet
 * based) — this wrapper owns exactly the WCM-specific pieces: the real data source
 * (`useNotificationBell`, SignalR + `useInfiniteQuery`), mapping `UserNotificationSummary` onto the
 * shared `NotificationItem` shape, the per-category icon and `order` description override, and the
 * separate detail dialog (opened via `onSelect` — the shared component has no detail view of its
 * own, since `UserNotificationSummary` carries no `body`, only a per-item fetch does).
 */
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

  const mapped = items.map(toNotificationItem);

  return (
    <>
      <SharedNotificationBell<WcmNotificationItem>
        items={mapped}
        unreadCount={unreadCount}
        loading={isLoading}
        error={isError ? t("notifications.error", "Couldn't load notifications") : null}
        onRetry={refetch}
        hasMore={hasNextPage}
        loadingMore={isFetchingNextPage}
        onLoadMore={fetchNextPage}
        onSelect={(notification) => openDetail(notification.id)}
        onMarkAsRead={(notification) => markAsRead(notification.id)}
        onMarkAllAsRead={markAllAsRead}
        renderConfig={notificationRenderConfig}
        getRenderKey={notificationRenderKey}
        renderIcon={(notification) => {
          const Icon = notificationCategoryIcon(notification.category ?? "");
          return <Icon className="size-3.5 text-muted-foreground" />;
        }}
      />

      <NotificationDetailDialog notificationId={openDetailId} open={openDetailId !== null} onOpenChange={(open) => !open && closeDetail()} onMarkAsRead={markAsRead} />
    </>
  );
}
