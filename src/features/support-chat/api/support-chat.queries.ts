"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supportChatService, type ConversationDetail, type ConversationListTab, type QueueConversationItem } from "@/services/support-chat";
import { useChatOwnershipStore } from "@/shared/stores/chat-ownership.store";

const QUEUE_PAGE_SIZE = 8;

export const conversationKeys = {
  all: ["conversations"] as const,
  queue: () => [...conversationKeys.all, "queue"] as const,
  owned: (ids: string[]) => [...conversationKeys.all, "owned", ...ids] as const,
  detail: (id: string) => [...conversationKeys.all, "detail", id] as const,
  handovers: () => [...conversationKeys.all, "handovers"] as const,
};

/** Unassigned tab — real cursor-paginated `GET /conversation-queues/items` (Waiting items only). */
export function useConversationQueueQuery() {
  return useInfiniteQuery({
    queryKey: conversationKeys.queue(),
    queryFn: ({ pageParam }) => supportChatService.getConversationQueue({ cursor: pageParam, limit: QUEUE_PAGE_SIZE }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}

/**
 * Assigned tab — Chat Service has no "list conversations assigned to me" endpoint (see the
 * backend audit note on `supportChatService`), so this hydrates whichever ids
 * `useChatOwnershipStore` has tracked for this browser via individual `getConversationDetail`
 * calls. Not a real list query — bounded by what this session has claimed/accepted, nothing more.
 */
export function useOwnedConversationsQuery() {
  const ownedIds = useChatOwnershipStore((state) => state.ownedConversationIds);
  return useQuery({
    queryKey: conversationKeys.owned(ownedIds),
    queryFn: async () => {
      const results = await Promise.all(ownedIds.map((id) => supportChatService.getConversationDetail(id).catch(() => null)));
      return results.filter((detail): detail is ConversationDetail => detail !== null);
    },
    enabled: ownedIds.length > 0,
    initialData: ownedIds.length === 0 ? [] : undefined,
  });
}

export function useConversationDetailQuery(id: string | null) {
  return useQuery({
    queryKey: conversationKeys.detail(id ?? ""),
    queryFn: () => supportChatService.getConversationDetail(id as string),
    enabled: !!id,
  });
}

export function useHandoverInvitationsQuery() {
  return useQuery({
    queryKey: conversationKeys.handovers(),
    queryFn: () => supportChatService.listHandoverInvitations(),
  });
}

function useInvalidateConversations() {
  const queryClient = useQueryClient();
  return (conversationId?: string) => {
    if (conversationId) queryClient.invalidateQueries({ queryKey: conversationKeys.detail(conversationId) });
    queryClient.invalidateQueries({ queryKey: conversationKeys.queue() });
    queryClient.invalidateQueries({ queryKey: [...conversationKeys.all, "owned"] });
  };
}

export function useClaimConversationMutation() {
  const invalidate = useInvalidateConversations();
  const markOwned = useChatOwnershipStore((state) => state.markOwned);
  return useMutation({
    mutationFn: (conversationId: string) => supportChatService.claimConversation(conversationId),
    onSuccess: (_data, conversationId) => {
      markOwned(conversationId);
      invalidate(conversationId);
    },
  });
}

export function useCloseConversationMutation() {
  const invalidate = useInvalidateConversations();
  return useMutation({
    mutationFn: (conversationId: string) => supportChatService.closeConversation(conversationId),
    onSuccess: (_data, conversationId) => invalidate(conversationId),
  });
}

export function useAcceptHandoverMutation() {
  const invalidate = useInvalidateConversations();
  const markOwned = useChatOwnershipStore((state) => state.markOwned);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitation: { transferRequestId: string; conversationId: string }) => supportChatService.acceptHandover(invitation.transferRequestId),
    onSuccess: (_data, invitation) => {
      markOwned(invitation.conversationId);
      invalidate(invitation.conversationId);
      queryClient.invalidateQueries({ queryKey: conversationKeys.handovers() });
    },
  });
}

export function useRejectHandoverMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (transferRequestId: string) => supportChatService.rejectHandover(transferRequestId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationKeys.handovers() }),
  });
}

export type { QueueConversationItem, ConversationListTab };
