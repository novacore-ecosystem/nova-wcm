"use client";

import { Badge, Button, FormField, FormSection, Input, Textarea } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { Form } from "@/shared/forms";
import { ContentEditor } from "@/features/content/components/ContentEditor";
import type { useContentWorkspace } from "@/features/content/components/ContentWorkspace/useContentWorkspace";

/** Adds/updates one target language on the active version — `translateForm` starts pre-filled from the active (source) language as a convenient starting point; the editor stays fully editable, nothing is submitted until the admin saves. */
export function TranslationsTab({ workspace }: { workspace: ReturnType<typeof useContentWorkspace> }) {
  const { t } = useAppTranslation();
  const { version, activeVersionId, translateForm, onTranslate, isTranslating, translateError } = workspace;

  if (!activeVersionId || !version) {
    return <p className="text-sm text-muted-foreground">{t("content.selectVersionFirst", "Select a version from the Versions tab first.")}</p>;
  }

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = translateForm;
  const values = watch();

  return (
    <div className="flex flex-col gap-6">
      <FormSection title={t("content.existingLanguages", "Existing languages on this version")}>
        <div className="flex flex-wrap gap-2">
          {version.localizations.map((localization) => (
            <Badge key={localization.culture} variant="outline">
              {localization.culture} — {localization.title}
            </Badge>
          ))}
        </div>
      </FormSection>

      <Form form={translateForm} onSubmit={onTranslate} className="flex flex-col gap-6">
        <FormSection title={t("content.addTranslation", "Add or update a translation")} description={t("content.addTranslationHelp", "Pre-filled from the source language above — translate the text before saving.")}>
          <FormField label={t("content.targetLanguage", "Target language")} htmlFor="targetLanguage" required error={errors.targetLanguage?.message}>
            <Input id="targetLanguage" placeholder="vi" invalid={!!errors.targetLanguage} {...register("targetLanguage")} />
          </FormField>
          <FormField label={t("content.titleField", "Title")} htmlFor="translateTitle" required error={errors.title?.message}>
            <Input id="translateTitle" invalid={!!errors.title} {...register("title")} />
          </FormField>
          <FormField label={t("content.summary", "Summary")} htmlFor="translateSummary" required error={errors.summary?.message}>
            <Textarea id="translateSummary" rows={3} {...register("summary")} />
          </FormField>
          <FormField label={t("content.body", "Content")} error={errors.body?.message as string | undefined}>
            <ContentEditor key={activeVersionId} value={values.body} onChange={(document) => setValue("body", document, { shouldDirty: true, shouldValidate: true })} invalid={!!errors.body} />
          </FormField>
        </FormSection>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={isTranslating}>
            {t("content.saveTranslation", "Save translation")}
          </Button>
          {translateError ? (
            <p role="alert" className="text-sm text-destructive">
              {translateError}
            </p>
          ) : null}
        </div>
      </Form>
    </div>
  );
}
