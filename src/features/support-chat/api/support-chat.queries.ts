"use client";

import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type { CursorPage } from "@/shared/lib/mock/cursorPagination";

import {
  supportChatService,
  type AiModeConfig,
  type ConversationListTab,
  type Conversation,
  type ConversationMessage,
  type ConversationPriority,
  type CustomerIdentity,
} from "@/services/support-chat";

type MessagesPageData = InfiniteData<CursorPage<ConversationMessage>, string | null>;

const CONVERSATIONS_PAGE_SIZE = 8;
const MESSAGES_PAGE_SIZE = 12;

export const conversationKeys = {
  all: ["conversations"] as const,
  list: (tab: ConversationListTab, keyword: string) => [...conversationKeys.all, "list", tab, keyword] as const,
  listAll: () => [...conversationKeys.all, "list"] as const,
  detail: (id: string) => [...conversationKeys.all, "detail", id] as const,
  messages: (id: string) => [...conversationKeys.all, "messages", id] as const,
  agents: () => [...conversationKeys.all, "agents"] as const,
};

/** Left-pane list: forward cursor pagination, one query per (tab, keyword) combination so switching tabs/searching never mixes pages from a different query. */
export function useConversationListQuery(tab: ConversationListTab, keyword: string) {
  return useInfiniteQuery({
    queryKey: conversationKeys.list(tab, keyword),
    queryFn: ({ pageParam }) => supportChatService.listConversations({ tab, keyword, cursor: pageParam, limit: CONVERSATIONS_PAGE_SIZE }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
  });
}

/** Right-pane header/state: the single opened conversation, independent of whichever list page it happens to live on. */
export function useConversationQuery(id: string | null) {
  return useQuery({
    queryKey: conversationKeys.detail(id ?? ""),
    queryFn: () => supportChatService.getConversation(id as string),
    enabled: !!id,
  });
}

/** Message history: initial page is the most recent messages; `fetchPreviousPage` prepends older ones. */
export function useMessageHistoryQuery(conversationId: string | null) {
  return useInfiniteQuery({
    queryKey: conversationKeys.messages(conversationId ?? ""),
    queryFn: ({ pageParam }) => supportChatService.listMessages(conversationId as string, { cursor: pageParam, limit: MESSAGES_PAGE_SIZE }),
    initialPageParam: null as string | null,
    getNextPageParam: () => undefined,
    getPreviousPageParam: (firstPage) => (firstPage.hasMore ? firstPage.nextCursor : undefined),
    enabled: !!conversationId,
  });
}

export function useAgentsQuery() {
  return useQuery({ queryKey: conversationKeys.agents(), queryFn: () => supportChatService.listAgents() });
}

export function usePendingHandoversQuery(agentId: string | undefined) {
  return useQuery({
    queryKey: [...conversationKeys.all, "pending-handovers", agentId],
    queryFn: () => supportChatService.listPendingHandoversFor(agentId as string),
    enabled: !!agentId,
  });
}

function useInvalidateConversations() {
  const queryClient = useQueryClient();
  return (updated: Conversation) => {
    queryClient.setQueryData(conversationKeys.detail(updated.id), updated);
    // Deliberately scoped to list + handover-inbox queries, NOT the messages thread — sendMessage
    // already patches the messages cache directly (see below), so invalidating it here would
    // trigger a redundant ~2s mock refetch and undo that optimistic append.
    queryClient.invalidateQueries({ queryKey: conversationKeys.listAll() });
    queryClient.invalidateQueries({ queryKey: [...conversationKeys.all, "pending-handovers"] });
  };
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateConversations();
  return useMutation({
    mutationFn: ({ conversationId, agentId, agentName, body }: { conversationId: string; agentId: string; agentName: string; body: string }) =>
      supportChatService.sendMessage(conversationId, { agentId, agentName, body }),
    onSuccess: ({ conversation, message }) => {
      queryClient.setQueryData<MessagesPageData>(conversationKeys.messages(conversation.id), (data) => {
        if (!data) return data;
        const pages = [...data.pages];
        const lastIndex = pages.length - 1;
        pages[lastIndex] = { ...pages[lastIndex], items: [...pages[lastIndex].items, message] };
        return { ...data, pages };
      });
      invalidate(conversation);
    },
  });
}

export function useSetPriorityMutation() {
  const invalidate = useInvalidateConversations();
  return useMutation({
    mutationFn: ({ id, priority }: { id: string; priority: ConversationPriority }) => supportChatService.setPriority(id, priority),
    onSuccess: invalidate,
  });
}

export function useCloseConversationMutation() {
  const invalidate = useInvalidateConversations();
  return useMutation({
    mutationFn: (id: string) => supportChatService.closeConversation(id),
    onSuccess: invalidate,
  });
}

export function useRequestHandoverMutation() {
  const invalidate = useInvalidateConversations();
  return useMutation({
    mutationFn: (input: { conversationId: string; fromAgentId: string; fromAgentName: string; toAgentId: string; toAgentName: string; reason?: string }) =>
      supportChatService.requestHandover(input.conversationId, input),
    onSuccess: invalidate,
  });
}

export function useAcceptHandoverMutation() {
  const invalidate = useInvalidateConversations();
  return useMutation({
    mutationFn: (id: string) => supportChatService.acceptHandover(id),
    onSuccess: invalidate,
  });
}

export function useRejectHandoverMutation() {
  const invalidate = useInvalidateConversations();
  return useMutation({
    mutationFn: (id: string) => supportChatService.rejectHandover(id),
    onSuccess: invalidate,
  });
}

export function useSetAiModeMutation() {
  const invalidate = useInvalidateConversations();
  return useMutation({
    mutationFn: ({ id, config }: { id: string; config: AiModeConfig }) => supportChatService.setAiMode(id, config),
    onSuccess: invalidate,
  });
}

export function useCreateConversationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (identity: CustomerIdentity) => supportChatService.createConversation(identity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationKeys.listAll() }),
  });
}
