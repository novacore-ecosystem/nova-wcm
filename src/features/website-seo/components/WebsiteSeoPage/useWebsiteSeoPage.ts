"use client";

import { useEffect } from "react";

import { useAppForm } from "@/shared/forms";
import { useUpdateWebsiteSeoSettingsMutation, useWebsiteSeoSettingsQuery } from "@/features/website-seo/api/website-seo.queries";
import { websiteSeoSchema, type WebsiteSeoFormValues } from "@/features/website-seo/website-seo.schema";

const EMPTY_VALUES: WebsiteSeoFormValues = {
  defaultMetaTitle: "",
  defaultMetaDescription: "",
  defaultSocialImageUrl: "",
  robotsIndexable: true,
};

export function useWebsiteSeoPage() {
  const settingsQuery = useWebsiteSeoSettingsQuery();
  const updateMutation = useUpdateWebsiteSeoSettingsMutation();
  const form = useAppForm(websiteSeoSchema, { defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (settingsQuery.data) form.reset(settingsQuery.data);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resync only when the loaded settings identity changes
  }, [settingsQuery.data]);

  async function onSubmit(values: WebsiteSeoFormValues) {
    await updateMutation.mutateAsync(values);
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
