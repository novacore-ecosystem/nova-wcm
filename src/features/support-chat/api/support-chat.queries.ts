"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supportChatService } from "@/services/support-chat";

export const conversationKeys = {
  all: ["conversations"] as const,
  detail: (id: string) => [...conversationKeys.all, "detail", id] as const,
};

export function useConversationsQuery() {
  return useQuery({ queryKey: conversationKeys.all, queryFn: () => supportChatService.listAll() });
}

export function useConversationQuery(id: string) {
  return useQuery({ queryKey: conversationKeys.detail(id), queryFn: () => supportChatService.get(id), enabled: !!id });
}

export function useAssignConversationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, agentId, agentName }: { id: string; agentId: string; agentName: string }) => supportChatService.assign(id, agentId, agentName),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
  });
}

export function useCloseConversationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supportChatService.close(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
  });
}

export function useSendMessageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, senderName, body }: { id: string; senderName: string; body: string }) =>
      supportChatService.appendMessage(id, { sender: "agent", senderName, body }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: conversationKeys.all }),
  });
}
