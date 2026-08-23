"use client";

import { Badge, FormField, FormSection, Input, Select } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { CONTENT_VISIBILITY_VALUES } from "@/features/content/content.schema";
import type { useContentWorkspace } from "@/features/content/components/ContentWorkspace/useContentWorkspace";

/**
 * Content type / slug / visibility only exist on `CreateContentRequest` — no update endpoint
 * accepts them (`UpdateContentDraftRequest` is Title/Summary/Body/Language only), so they're
 * editable here only in create mode; edit mode shows them read-only.
 */
export function BasicInfoTab({ workspace }: { workspace: ReturnType<typeof useContentWorkspace> }) {
  const { t } = useAppTranslation();
  const { isEditing, detail, contentTypes, createForm } = workspace;

  if (isEditing) {
    return (
      <div className="grid gap-6">
        <FormSection title={t("content.basicInfo", "Basic information")}>
          <FormField label={t("content.contentType", "Content type")}>
            <p className="text-sm">{detail?.contentTypeName ?? "—"}</p>
          </FormField>
          <FormField label={t("content.slug", "Slug")} description={t("content.slugImmutableHelp", "Set at creation — cannot be changed.")}>
            <p className="text-sm text-muted-foreground">/{detail?.slug ?? "—"}</p>
          </FormField>
          <FormField label={t("content.visibility", "Visibility")} description={t("content.visibilityImmutableHelp", "Set at creation — cannot be changed.")}>
            <Badge variant="outline" className="w-fit capitalize">
              {detail?.visibility ?? "—"}
            </Badge>
          </FormField>
        </FormSection>
      </div>
    );
  }

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = createForm;
  const values = watch();

  return (
    <div className="grid gap-6">
      <FormSection title={t("content.basicInfo", "Basic information")}>
        <FormField label={t("content.contentType", "Content type")} htmlFor="contentTypeId" required error={errors.contentTypeId?.message}>
          <Select
            value={values.contentTypeId || undefined}
            onValueChange={(value) => setValue("contentTypeId", value)}
            placeholder={t("content.contentTypePlaceholder", "Select a content type")}
            options={contentTypes.map((type) => ({ value: type.id, label: type.name }))}
          />
        </FormField>
        <FormField label={t("content.slug", "Slug")} htmlFor="slug" required error={errors.slug?.message} description={t("content.slugHelp", "Cannot be changed after creation.")}>
          <Input id="slug" invalid={!!errors.slug} {...register("slug")} />
        </FormField>
        <FormField label={t("content.language", "Language")} htmlFor="language" description={t("content.languageCreateHelp", "Optional — leave blank to use the service default.")}>
          <Input id="language" {...register("language")} placeholder="en" />
        </FormField>
        <FormField label={t("content.visibility", "Visibility")} htmlFor="visibility" description={t("content.visibilityHelp", "Cannot be changed after creation.")}>
          <Select
            value={values.visibility}
            onValueChange={(value) => setValue("visibility", value as (typeof CONTENT_VISIBILITY_VALUES)[number])}
            options={CONTENT_VISIBILITY_VALUES.map((value) => ({ value, label: value }))}
          />
        </FormField>
      </FormSection>
    </div>
  );
}
