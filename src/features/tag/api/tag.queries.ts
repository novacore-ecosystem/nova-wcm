"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { tagService } from "@/features/tag/api/tag.service";
import type { TagFormValues } from "@/features/tag/tag.schema";

export const tagKeys = {
  all: ["tags"] as const,
  list: (request: CriteriaRequest) => [...tagKeys.all, "list", request] as const,
  listAll: () => [...tagKeys.all, "listAll"] as const,
};

export function useTagsQuery(request: CriteriaRequest) {
  return useQuery({ queryKey: tagKeys.list(request), queryFn: () => tagService.list(request), placeholderData: (previous) => previous });
}

export function useAllTagsQuery() {
  return useQuery({ queryKey: tagKeys.listAll(), queryFn: tagService.listAll });
}

export function useCreateTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: TagFormValues) => tagService.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tagKeys.all }),
  });
}

export function useUpdateTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: TagFormValues }) => tagService.update(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tagKeys.all }),
  });
}

export function useDeleteTagMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tagKeys.all }),
  });
}
