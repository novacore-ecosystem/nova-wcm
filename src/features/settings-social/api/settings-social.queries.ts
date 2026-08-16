"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getSocialLinksSettings, updateSocialLinksSettings, type SocialLinksSettings } from "@/services/settings-social";

export const settingsSocialKeys = {
  all: ["settings-social"] as const,
};

export function useSocialLinksSettingsQuery() {
  return useQuery({ queryKey: settingsSocialKeys.all, queryFn: getSocialLinksSettings });
}

export function useUpdateSocialLinksSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (patch: Partial<SocialLinksSettings>) => updateSocialLinksSettings(patch),
    onSuccess: (updated) => queryClient.setQueryData(settingsSocialKeys.all, updated),
  });
}
