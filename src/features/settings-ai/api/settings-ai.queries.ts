"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAiTenantSettings, updateAiTenantSettings, type AiTenantSettings } from "@/services/settings-ai";

export const settingsAiKeys = { all: ["settings-ai"] as const };

export function useAiTenantSettingsQuery() {
  return useQuery({ queryKey: settingsAiKeys.all, queryFn: getAiTenantSettings });
}

export function useUpdateAiTenantSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<Omit<AiTenantSettings, "apiKeyConfigured">> & { apiKey?: string }) => updateAiTenantSettings(patch),
    onSuccess: (updated) => queryClient.setQueryData(settingsAiKeys.all, updated),
  });
}
