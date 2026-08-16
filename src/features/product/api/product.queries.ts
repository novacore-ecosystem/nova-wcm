"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { productService } from "@/features/product/api/product.service";
import type { ProductFormValues } from "@/features/product/product.schema";

export const productKeys = {
  all: ["products"] as const,
  list: (request: CriteriaRequest) => [...productKeys.all, "list", request] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

/** Accepts a ready-built `CriteriaRequest` — see `useProductListPage` for how search/category/status filters and sort are translated into one via `criteriaFilter`/`criteriaSort`. */
export function useProductsQuery(request: CriteriaRequest) {
  return useQuery({
    queryKey: productKeys.list(request),
    queryFn: () => productService.list(request),
    placeholderData: (previous) => previous,
  });
}

export function useProductQuery(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.get(id),
    enabled: !!id,
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ProductFormValues) => productService.create(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useUpdateProductMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: ProductFormValues) => productService.update(id, values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  });
}
