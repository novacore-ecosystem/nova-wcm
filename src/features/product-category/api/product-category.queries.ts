"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { productCategoryService } from "@/features/product-category/api/product-category.service";
import type { ProductCategoryFormValues } from "@/features/product-category/product-category.schema";

export const productCategoryKeys = {
  all: ["product-categories"] as const,
  list: (request: CriteriaRequest) => [...productCategoryKeys.all, "list", request] as const,
  listAll: () => [...productCategoryKeys.all, "listAll"] as const,
  detail: (id: string) => [...productCategoryKeys.all, "detail", id] as const,
};

export function useProductCategoriesQuery(request: CriteriaRequest) {
  return useQuery({
    queryKey: productCategoryKeys.list(request),
    queryFn: () => productCategoryService.list(request),
    placeholderData: (previous) => previous,
  });
}

export function useAllProductCategoriesQuery() {
  return useQuery({ queryKey: productCategoryKeys.listAll(), queryFn: productCategoryService.listAll });
}

export function useProductCategoryQuery(id: string) {
  return useQuery({
    queryKey: productCategoryKeys.detail(id),
    queryFn: () => productCategoryService.get(id),
    enabled: !!id,
  });
}

export function useCreateProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ProductCategoryFormValues) => productCategoryService.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productCategoryKeys.all }),
  });
}

export function useUpdateProductCategoryMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ProductCategoryFormValues) => productCategoryService.update(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productCategoryKeys.all }),
  });
}

export function useDeleteProductCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productCategoryService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productCategoryKeys.all }),
  });
}
