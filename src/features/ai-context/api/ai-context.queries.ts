"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { aiContextService, type AiContextGroup } from "@/services/ai-context";

export const aiContextKeys = {
  all: ["ai-context"] as const,
  groups: () => [...aiContextKeys.all, "groups"] as const,
  personal: () => [...aiContextKeys.all, "personal"] as const,
};

export function useAiContextGroupsQuery() {
  return useQuery({ queryKey: aiContextKeys.groups(), queryFn: () => aiContextService.listAllGroups() });
}

export function usePersonalAiContextQuery() {
  return useQuery({ queryKey: aiContextKeys.personal(), queryFn: () => aiContextService.getPersonalContext() });
}

export function useCreateAiContextGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (row: AiContextGroup) => aiContextService.createGroup(row),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: aiContextKeys.groups() }),
  });
}

export function useUpdateAiContextGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<AiContextGroup> }) => aiContextService.updateGroup(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: aiContextKeys.groups() }),
  });
}

export function useDeleteAiContextGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => aiContextService.removeGroup(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: aiContextKeys.groups() }),
  });
}

export function useUpdatePersonalAiContextMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => aiContextService.updatePersonalContext(content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: aiContextKeys.personal() }),
  });
}
