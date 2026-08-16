"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getGeneralSettings, updateGeneralSettings, type GeneralSettings } from "@/services/settings-general";

export const settingsGeneralKeys = {
  all: ["settings-general"] as const,
};

export function useGeneralSettingsQuery() {
  return useQuery({ queryKey: settingsGeneralKeys.all, queryFn: getGeneralSettings });
}

export function useUpdateGeneralSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<GeneralSettings>) => updateGeneralSettings(patch),
    onSuccess: (updated) => queryClient.setQueryData(settingsGeneralKeys.all, updated),
  });
}
