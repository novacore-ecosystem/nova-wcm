"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getWebsiteSeoSettings, updateWebsiteSeoSettings, type WebsiteSeoSettings } from "@/services/website-seo";

export const websiteSeoKeys = {
  all: ["website-seo"] as const,
};

export function useWebsiteSeoSettingsQuery() {
  return useQuery({ queryKey: websiteSeoKeys.all, queryFn: getWebsiteSeoSettings });
}

export function useUpdateWebsiteSeoSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<WebsiteSeoSettings>) => updateWebsiteSeoSettings(patch),
    onSuccess: (updated) => queryClient.setQueryData(websiteSeoKeys.all, updated),
  });
}
