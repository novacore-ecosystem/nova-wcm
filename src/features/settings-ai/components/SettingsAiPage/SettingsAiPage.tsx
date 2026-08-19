"use client";

import { KeyRound, ShieldCheck } from "lucide-react";
import { Badge, Button, ErrorState, FormActions, FormField, FormSection, Input, PageContainer, PageHeader, Select, SkeletonList } from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useSettingsAiPage } from "@/features/settings-ai/components/SettingsAiPage/useSettingsAiPage";

export function SettingsAiPage() {
  const { t } = useAppTranslation();
  const { isLoading, isError, refetch, apiKeyConfigured, form, onSubmit, isSubmitting } = useSettingsAiPage();
  const { register, watch } = form;
  const mode = watch("mode");

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("settingsAi.title", "AI configuration")}
          description={t("settingsAi.description", "Configures which AI provider/model the NovaCore AI Service should route this tenant's requests to. WCM never talks to a provider SDK directly.")}
        />

        {isLoading ? (
          <SkeletonList rows={5} />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <Form form={form} onSubmit={onSubmit} className="flex max-w-2xl flex-col gap-6">
            <FormSection title={t("settingsAi.mode", "AI mode")}>
              <FormField htmlFor="mode">
                <Select
                  value={mode}
                  onValueChange={(value) => form.setValue("mode", value as "managed" | "byok")}
                  options={[
                    { value: "managed", label: t("settingsAi.modeManaged", "Managed by NovaCore") },
                    { value: "byok", label: t("settingsAi.modeByok", "Bring your own key") },
                  ]}
                />
              </FormField>

              {mode === "byok" ? (
                <>
                  <FormField label={t("settingsAi.provider", "Provider")} htmlFor="provider">
                    <Select
                      value={watch("provider")}
                      onValueChange={(value) => form.setValue("provider", value as "openai" | "anthropic" | "gemini")}
                      placeholder={t("settingsAi.providerPlaceholder", "Select a provider")}
                      options={[
                        { value: "openai", label: "OpenAI" },
                        { value: "anthropic", label: "Anthropic" },
                        { value: "gemini", label: "Gemini" },
                      ]}
                    />
                  </FormField>
                  <FormField
                    label={t("settingsAi.apiKey", "API key")}
                    htmlFor="apiKey"
                    description={
                      apiKeyConfigured
                        ? t("settingsAi.apiKeyConfiguredHelp", "A key is already configured. Leave blank to keep it, or enter a new one to replace it.")
                        : t("settingsAi.apiKeyHelp", "Stored securely on the backend once one exists — never shown again after saving.")
                    }
                  >
                    <div className="flex items-center gap-2">
                      <Input id="apiKey" type="password" placeholder={apiKeyConfigured ? "••••••••••••" : "sk-…"} {...register("apiKey")} />
                      {apiKeyConfigured ? (
                        <Badge variant="success" className="flex shrink-0 items-center gap-1">
                          <ShieldCheck className="size-3" />
                          {t("settingsAi.configured", "Configured")}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex shrink-0 items-center gap-1">
                          <KeyRound className="size-3" />
                          {t("settingsAi.notConfigured", "Not set")}
                        </Badge>
                      )}
                    </div>
                  </FormField>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("settingsAi.managedHelp", "NovaCore manages the provider and key for you. No key needed here.")}
                </p>
              )}
            </FormSection>

            <FormSection title={t("settingsAi.models", "Models")} description={t("settingsAi.modelsHelp", "Optional — leave blank to use NovaCore's defaults for each purpose.")}>
              <FormField label={t("settingsAi.defaultModel", "Default model")} htmlFor="defaultModel">
                <Input id="defaultModel" {...register("defaultModel")} />
              </FormField>
              <FormField label={t("settingsAi.contentModel", "Content model")} htmlFor="contentModel" description={t("settingsAi.contentModelHelp", "Used by article writing/AI actions.")}>
                <Input id="contentModel" {...register("contentModel")} />
              </FormField>
              <FormField label={t("settingsAi.supportModel", "Support model")} htmlFor="supportModel" description={t("settingsAi.supportModelHelp", "Used by AI participation in customer conversations.")}>
                <Input id="supportModel" {...register("supportModel")} />
              </FormField>
            </FormSection>

            <FormActions>
              <Button type="submit" loading={isSubmitting}>
                {t("common.save", "Save")}
              </Button>
            </FormActions>
          </Form>
        )}
      </div>
    </PageContainer>
  );
}
