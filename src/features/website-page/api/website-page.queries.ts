"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CriteriaRequest } from "@novacore/frontend-foundation";

import {
  createWebsitePage,
  getWebsitePage,
  listWebsitePages,
  removeWebsitePage,
  setWebsitePageStatus,
  updateWebsitePage,
  type WebsitePageInput,
  type WebsitePageStatus,
} from "@/services/website-page";

export const websitePageKeys = {
  all: ["website-page"] as const,
  list: (request: CriteriaRequest) => [...websitePageKeys.all, "list", request] as const,
  detail: (id: string) => [...websitePageKeys.all, "detail", id] as const,
};

export function useWebsitePagesQuery(request: CriteriaRequest) {
  return useQuery({
    queryKey: websitePageKeys.list(request),
    queryFn: () => listWebsitePages(request),
    placeholderData: keepPreviousData,
  });
}

export function useWebsitePageQuery(id: string | undefined) {
  return useQuery({
    queryKey: websitePageKeys.detail(id ?? ""),
    queryFn: () => getWebsitePage(id as string),
    enabled: !!id,
  });
}

export function useCreateWebsitePageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: WebsitePageInput) => createWebsitePage(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: websitePageKeys.all }),
  });
}

export function useUpdateWebsitePageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: WebsitePageInput }) => updateWebsitePage(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: websitePageKeys.all }),
  });
}

export function useSetWebsitePageStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: WebsitePageStatus }) => setWebsitePageStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: websitePageKeys.all }),
  });
}

export function useDeleteWebsitePageMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeWebsitePage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: websitePageKeys.all }),
  });
}
