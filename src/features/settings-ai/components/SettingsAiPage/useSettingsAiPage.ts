"use client";

import { useEffect } from "react";

import { useAppForm } from "@/shared/forms";
import { useAiTenantSettingsQuery, useUpdateAiTenantSettingsMutation } from "@/features/settings-ai/api/settings-ai.queries";
import { aiTenantSettingsSchema, type AiTenantSettingsFormValues } from "@/features/settings-ai/settings-ai.schema";

const EMPTY_VALUES: AiTenantSettingsFormValues = {
  mode: "managed",
  provider: undefined,
  defaultModel: "",
  contentModel: "",
  supportModel: "",
  apiKey: "",
};

export function useSettingsAiPage() {
  const settingsQuery = useAiTenantSettingsQuery();
  const updateMutation = useUpdateAiTenantSettingsMutation();
  const form = useAppForm(aiTenantSettingsSchema, { defaultValues: EMPTY_VALUES });

  useEffect(() => {
    if (settingsQuery.data) {
      form.reset({
        mode: settingsQuery.data.mode,
        provider: settingsQuery.data.provider ?? undefined,
        defaultModel: settingsQuery.data.defaultModel ?? "",
        contentModel: settingsQuery.data.contentModel ?? "",
        supportModel: settingsQuery.data.supportModel ?? "",
        apiKey: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsQuery.data]);

  async function onSubmit(values: AiTenantSettingsFormValues) {
    await updateMutation.mutateAsync({
      mode: values.mode,
      provider: values.mode === "byok" ? values.provider ?? null : null,
      defaultModel: values.defaultModel || undefined,
      contentModel: values.contentModel || undefined,
      supportModel: values.supportModel || undefined,
      apiKey: values.apiKey || undefined,
    });
    form.setValue("apiKey", "");
  }

  return {
    isLoading: settingsQuery.isLoading,
    isError: settingsQuery.isError,
    refetch: settingsQuery.refetch,
    apiKeyConfigured: settingsQuery.data?.apiKeyConfigured ?? false,
    form,
    onSubmit,
    isSubmitting: updateMutation.isPending,
  };
}
