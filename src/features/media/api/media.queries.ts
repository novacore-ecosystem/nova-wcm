"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CriteriaRequest } from "@novacore/frontend-foundation";

import {
  createMediaAsset,
  getMediaAsset,
  listMediaAssets,
  removeMediaAsset,
  updateMediaAsset,
  type CreateMediaAssetInput,
  type MediaAsset,
} from "@/services/media";

export const mediaKeys = {
  all: ["media"] as const,
  list: (request: CriteriaRequest) => [...mediaKeys.all, "list", request] as const,
  detail: (id: string) => [...mediaKeys.all, "detail", id] as const,
};

export function useMediaAssetsQuery(request: CriteriaRequest) {
  return useQuery({
    queryKey: mediaKeys.list(request),
    queryFn: () => listMediaAssets(request),
    placeholderData: keepPreviousData,
  });
}

export function useMediaAssetQuery(id: string | undefined) {
  return useQuery({
    queryKey: mediaKeys.detail(id ?? ""),
    queryFn: () => getMediaAsset(id as string),
    enabled: !!id,
  });
}

export function useCreateMediaAssetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMediaAssetInput) => createMediaAsset(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mediaKeys.all }),
  });
}

export function useUpdateMediaAssetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<MediaAsset> }) => updateMediaAsset(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mediaKeys.all }),
  });
}

export function useDeleteMediaAssetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeMediaAsset(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: mediaKeys.all }),
  });
}
