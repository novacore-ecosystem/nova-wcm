"use client";

import { useMemo, useState } from "react";

import { useMarkNotificationAsReadMutation, useNotificationListQuery } from "@/features/notifications/api/notification.queries";

/**
 * `unreadCount` is only accurate for the currently loaded page(s) — there's no dedicated
 * unread-count endpoint on the backend (only the paginated list itself), same bounded-approximation
 * tradeoff admin-portal's own `NotificationBell` makes, but here backed by the real `status` field
 * the REST response actually returns rather than a client-side read-tracking workaround.
 */
export function useNotificationBell() {
  const query = useNotificationListQuery();
  const markAsReadMutation = useMarkNotificationAsReadMutation();
  const [openDetailId, setOpenDetailId] = useState<string | null>(null);

  const items = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data]);
  const unreadCount = useMemo(() => items.filter((item) => item.status === "unread").length, [items]);

  function markAsRead(notificationId: string) {
    markAsReadMutation.mutate(notificationId);
  }

  function markAllAsRead() {
    for (const item of items) {
      if (item.status === "unread") markAsReadMutation.mutate(item.id);
    }
  }

  return {
    items,
    unreadCount,
    isLoading: query.isLoading,
    isError: query.isError,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: () => void query.fetchNextPage(),
    refetch: () => void query.refetch(),
    openDetailId,
    openDetail: setOpenDetailId,
    closeDetail: () => setOpenDetailId(null),
    markAsRead,
    markAllAsRead,
  };
}
