"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { articleCategoryService } from "@/features/article-category/api/article-category.service";
import type { ArticleCategoryFormValues } from "@/features/article-category/article-category.schema";

export const articleCategoryKeys = {
  all: ["article-categories"] as const,
  list: (request: CriteriaRequest) => [...articleCategoryKeys.all, "list", request] as const,
  listAll: () => [...articleCategoryKeys.all, "listAll"] as const,
  detail: (id: string) => [...articleCategoryKeys.all, "detail", id] as const,
};

export function useArticleCategoriesQuery(request: CriteriaRequest) {
  return useQuery({
    queryKey: articleCategoryKeys.list(request),
    queryFn: () => articleCategoryService.list(request),
    placeholderData: (previous) => previous,
  });
}

export function useAllArticleCategoriesQuery() {
  return useQuery({ queryKey: articleCategoryKeys.listAll(), queryFn: articleCategoryService.listAll });
}

export function useArticleCategoryQuery(id: string) {
  return useQuery({ queryKey: articleCategoryKeys.detail(id), queryFn: () => articleCategoryService.get(id), enabled: !!id });
}

export function useCreateArticleCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ArticleCategoryFormValues) => articleCategoryService.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleCategoryKeys.all }),
  });
}

export function useUpdateArticleCategoryMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ArticleCategoryFormValues) => articleCategoryService.update(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleCategoryKeys.all }),
  });
}

export function useDeleteArticleCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => articleCategoryService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: articleCategoryKeys.all }),
  });
}
