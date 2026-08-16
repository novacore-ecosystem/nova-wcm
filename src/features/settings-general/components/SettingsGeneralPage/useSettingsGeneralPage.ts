"use client";

import { useEffect } from "react";

import { useAppForm } from "@/shared/forms";
import { useGeneralSettingsQuery, useUpdateGeneralSettingsMutation } from "@/features/settings-general/api/settings-general.queries";
import { generalSettingsSchema, type GeneralSettingsFormValues } from "@/features/settings-general/settings-general.schema";

const EMPTY_VALUES: GeneralSettingsFormValues = {
  siteName: "",
  logoUrl: "",
  faviconUrl: "",
  contactEmail: "",
  contactPhone: "",
  contactAddress: "",
};

export function useSettingsGeneralPage() {
  const settingsQuery = useGeneralSettingsQuery();
  const updateMutation = useUpdateGeneralSettingsMutation();
  const form = useAppForm(generalSettingsSchema, { defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (settingsQuery.data) {
      form.reset({
        siteName: settingsQuery.data.siteName,
        logoUrl: settingsQuery.data.logoUrl ?? "",
        faviconUrl: settingsQuery.data.faviconUrl ?? "",
        contactEmail: settingsQuery.data.contactEmail ?? "",
        contactPhone: settingsQuery.data.contactPhone ?? "",
        contactAddress: settingsQuery.data.contactAddress ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resync only when the loaded settings identity changes
  }, [settingsQuery.data]);

  async function onSubmit(values: GeneralSettingsFormValues) {
    await updateMutation.mutateAsync({
      siteName: values.siteName,
      logoUrl: values.logoUrl || undefined,
      faviconUrl: values.faviconUrl || undefined,
      contactEmail: values.contactEmail || undefined,
      contactPhone: values.contactPhone || undefined,
      contactAddress: values.contactAddress || undefined,
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
