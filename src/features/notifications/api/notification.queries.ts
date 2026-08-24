"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";

import { notificationService, type CursorPaginatedResult, type UserNotificationSummary } from "@/services/notification";

const PAGE_SIZE = 10;

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  detail: (notificationId: string) => [...notificationKeys.all, "detail", notificationId] as const,
};

/**
 * Bounded to `PAGE_SIZE` per page (loaded page(s) drive both the bell's unread badge and the
 * dropdown list — same query, no duplicate fetch) via `hasNextPage`/`fetchNextPage` "Load more",
 * matching `useAdminContentSearchQuery`'s cursor pattern. No `status` filter is sent — the
 * dropdown shows the caller's most recent notifications regardless of read state.
 */
export function useNotificationListQuery() {
  return useInfiniteQuery({
    queryKey: notificationKeys.list(),
    queryFn: ({ pageParam }) => notificationService.listMine({ cursor: pageParam, limit: PAGE_SIZE }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}

/** `GET /user-notifications/{id}` — adds `body` for the detail dialog's content renderer. */
export function useNotificationDetailQuery(notificationId: string | undefined) {
  return useQuery({
    queryKey: notificationKeys.detail(notificationId ?? ""),
    queryFn: () => notificationService.getById(notificationId as string),
    enabled: !!notificationId,
  });
}

/**
 * Patches the item's `status` directly in the list cache (real id from a REST fetch makes this
 * safe) instead of invalidating — avoids a refetch just to flip one field. The detail query (if
 * cached) is invalidated separately since it also carries `readAt`, which this mutation doesn't
 * return.
 */
export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: (_data, notificationId) => {
      queryClient.setQueriesData<InfiniteData<CursorPaginatedResult<UserNotificationSummary>>>({ queryKey: notificationKeys.list() }, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => (item.id === notificationId ? { ...item, status: "read" as const } : item)),
          })),
        };
      });
      queryClient.invalidateQueries({ queryKey: notificationKeys.detail(notificationId) });
    },
  });
}
