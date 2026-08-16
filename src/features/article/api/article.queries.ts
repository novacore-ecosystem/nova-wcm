"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { articleService } from "@/features/article/api/article.service";
import type { ArticleFormValues } from "@/features/article/article.schema";

export const articleKeys = {
  all: ["articles"] as const,
  list: (request: CriteriaRequest) => [...articleKeys.all, "list", request] as const,
  detail: (id: string) => [...articleKeys.all, "detail", id] as const,
};

export function useArticlesQuery(request: CriteriaRequest) {
  return useQuery({ queryKey: articleKeys.list(request), queryFn: () => articleService.list(request), placeholderData: (previous) => previous });
}

export function useArticleQuery(id: string) {
  return useQuery({ queryKey: articleKeys.detail(id), queryFn: () => articleService.get(id), enabled: !!id });
}

export function useCreateArticleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ArticleFormValues) => articleService.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleKeys.all }),
  });
}

export function useUpdateArticleMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ArticleFormValues) => articleService.update(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleKeys.all }),
  });
}

export function useDeleteArticleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articleService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleKeys.all }),
  });
}
