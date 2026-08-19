"use client";

import { useDebouncedValue } from "@novacore/frontend-next-shadcn";

import { useAcceptHandoverMutation, useConversationListQuery, useRejectHandoverMutation, usePendingHandoversQuery } from "@/features/support-chat/api/support-chat.queries";
import { useSessionStore } from "@/shared/stores/session.store";
import type { ConversationListTab } from "@/services/support-chat";

/**
 * Owns everything the left pane needs: its own tab + search state (received from the workspace so
 * the composer's auto-assign flow can drive it too), the resulting cursor-paginated query, and the
 * handover inbox. Does NOT know about `openedConversationId` beyond receiving it for highlighting
 * — selecting an item never mutates this hook's own state.
 */
export function useConversationListPane(activeTab: ConversationListTab, searchQuery: string) {
  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const currentUser = useSessionStore((state) => state.user);

  const listQuery = useConversationListQuery(activeTab, debouncedSearch);
  const items = listQuery.data?.pages.flatMap((page) => page.items) ?? [];

  const handoversQuery = usePendingHandoversQuery(currentUser?.id);
  const acceptMutation = useAcceptHandoverMutation();
  const rejectMutation = useRejectHandoverMutation();
  const busyHandoverId = acceptMutation.isPending ? (acceptMutation.variables as string) : rejectMutation.isPending ? (rejectMutation.variables as string) : null;

  return {
    listQuery,
    items,
    handovers: handoversQuery.data ?? [],
    acceptHandover: (id: string) => acceptMutation.mutate(id),
    rejectHandover: (id: string) => rejectMutation.mutate(id),
    busyHandoverId,
  };
}
