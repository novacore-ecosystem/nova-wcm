"use client";

import { useEffect } from "react";

import { useAppForm } from "@/shared/forms";
import { useSocialLinksSettingsQuery, useUpdateSocialLinksSettingsMutation } from "@/features/settings-social/api/settings-social.queries";
import { socialLinksSchema, type SocialLinksFormValues } from "@/features/settings-social/settings-social.schema";

const EMPTY_VALUES: SocialLinksFormValues = {
  facebookUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  zaloUrl: "",
  tiktokUrl: "",
};

export function useSettingsSocialPage() {
  const settingsQuery = useSocialLinksSettingsQuery();
  const updateMutation = useUpdateSocialLinksSettingsMutation();
  const form = useAppForm(socialLinksSchema, { defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (settingsQuery.data) {
      form.reset({
        facebookUrl: settingsQuery.data.facebookUrl ?? "",
        youtubeUrl: settingsQuery.data.youtubeUrl ?? "",
        linkedinUrl: settingsQuery.data.linkedinUrl ?? "",
        zaloUrl: settingsQuery.data.zaloUrl ?? "",
        tiktokUrl: settingsQuery.data.tiktokUrl ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resync only when the loaded settings identity changes
  }, [settingsQuery.data]);

  async function onSubmit(values: SocialLinksFormValues) {
    await updateMutation.mutateAsync({
      facebookUrl: values.facebookUrl || undefined,
      youtubeUrl: values.youtubeUrl || undefined,
      linkedinUrl: values.linkedinUrl || undefined,
      zaloUrl: values.zaloUrl || undefined,
      tiktokUrl: values.tiktokUrl || undefined,
    });
  }

  return {
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    refetch: settingsQuery.refetch,
    form,
    onSubmit,
    isSubmitting: updateMutation.isPending,
  };
}
