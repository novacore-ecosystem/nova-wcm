"use client";

import { useDebouncedValue } from "@novacore/frontend-next-shadcn";

import {
  useAcceptHandoverMutation,
  useClaimConversationMutation,
  useConversationQueueQuery,
  useHandoverInvitationsQuery,
  useOwnedConversationsQuery,
  useRejectHandoverMutation,
} from "@/features/support-chat/api/support-chat.queries";
import type { ConversationDetail, ConversationListTab, ConversationPriority, ConversationType, QueueConversationItem } from "@/services/support-chat";

/** Normalizes the two very different item shapes (queue item vs. hydrated conversation detail — see `useOwnedConversationsQuery`'s doc comment) into one shape `ConversationListItem` can render. */
export interface ConversationListEntry {
  conversationId: string;
  title?: string;
  type: ConversationType;
  priority: ConversationPriority;
  timestamp: string;
  isClosed: boolean;
  needsClaim: boolean;
}

function fromQueueItem(item: QueueConversationItem): ConversationListEntry {
  return { conversationId: item.conversationId, title: item.title, type: item.type, priority: item.priority, timestamp: item.enqueuedAt, isClosed: false, needsClaim: true };
}

function fromOwnedDetail(detail: ConversationDetail): ConversationListEntry {
  return { conversationId: detail.id, title: detail.title, type: detail.type, priority: detail.priority, timestamp: detail.lastActivityAt, isClosed: detail.status === "closed", needsClaim: false };
}

const PRIORITY_RANK: Record<ConversationPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 };

function compareEntries(a: ConversationListEntry, b: ConversationListEntry): number {
  if (a.isClosed !== b.isClosed) return a.isClosed ? 1 : -1;
  const priorityDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  if (priorityDiff !== 0) return priorityDiff;
  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
}

function matchesKeyword(entry: ConversationListEntry, keyword: string): boolean {
  const needle = keyword.trim().toLowerCase();
  if (!needle) return true;
  return (entry.title ?? "").toLowerCase().includes(needle) || entry.conversationId.toLowerCase().includes(needle);
}

/**
 * Owns everything the left pane needs. No server-side keyword search exists for either tab
 * (`GetConversationQueue` takes no search param, and there's no list-by-assignee endpoint at
 * all) — `searchQuery` filters client-side over whatever page is currently loaded, not a real
 * search. Does NOT know about `openedConversationId` beyond receiving it for highlighting.
 */
export function useConversationListPane(activeTab: ConversationListTab, searchQuery: string) {
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const queueQuery = useConversationQueueQuery();
  const ownedQuery = useOwnedConversationsQuery();

  const entries =
    activeTab === "unassigned"
      ? (queueQuery.data?.pages.flatMap((page) => page.items) ?? []).map(fromQueueItem)
      : (ownedQuery.data ?? []).map(fromOwnedDetail).sort(compareEntries);
  const filtered = entries.filter((entry) => matchesKeyword(entry, debouncedSearch));

  const handoversQuery = useHandoverInvitationsQuery();
  const acceptMutation = useAcceptHandoverMutation();
  const rejectMutation = useRejectHandoverMutation();
  const claimMutation = useClaimConversationMutation();

  const busyHandoverId = acceptMutation.isPending
    ? (acceptMutation.variables as { transferRequestId: string }).transferRequestId
    : rejectMutation.isPending
      ? (rejectMutation.variables as string)
      : null;

  return {
    isLoading: activeTab === "unassigned" ? queueQuery.isLoading : ownedQuery.isLoading,
    hasNextPage: activeTab === "unassigned" ? queueQuery.hasNextPage : false,
    isFetchingNextPage: activeTab === "unassigned" ? queueQuery.isFetchingNextPage : false,
    fetchNextPage: () => queueQuery.fetchNextPage(),
    items: filtered,
    handovers: handoversQuery.data ?? [],
    acceptHandover: (transferRequestId: string, conversationId: string) => acceptMutation.mutate({ transferRequestId, conversationId }),
    rejectHandover: (transferRequestId: string) => rejectMutation.mutate(transferRequestId),
    busyHandoverId,
    claimConversation: (conversationId: string) => claimMutation.mutate(conversationId),
    isClaiming: claimMutation.isPending,
    claimingId: claimMutation.isPending ? (claimMutation.variables as string) : null,
  };
}
