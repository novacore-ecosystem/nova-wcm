"use client";

import { Button, FormField, FormSection, Input, Select, Textarea } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { Form } from "@/shared/forms";
import { ContentEditor } from "@/features/content/components/ContentEditor";
import type { useContentWorkspace } from "@/features/content/components/ContentWorkspace/useContentWorkspace";

/**
 * Create mode shares the outer `createForm`/`onCreateSubmit` (see `ContentWorkspace.tsx`'s single
 * "Create" action) — fields render directly, no local form/submit here. Edit mode has no single
 * page-level submit (Save draft / Publish / Translate / Delete are independent actions against a
 * versioned aggregate), so it wraps its own fields in a local `draftForm`/`onSaveDraft` submit.
 */
export function WritingTab({ workspace }: { workspace: ReturnType<typeof useContentWorkspace> }) {
  const { t } = useAppTranslation();

  if (!workspace.isEditing) {
    const {
      register,
      watch,
      setValue,
      formState: { errors },
    } = workspace.createForm;
    const values = watch();

    return (
      <FormSection title={t("content.writing", "Writing")}>
        <FormField label={t("content.titleField", "Title")} htmlFor="title" required error={errors.title?.message}>
          <Input id="title" invalid={!!errors.title} {...register("title")} />
        </FormField>
        <FormField label={t("content.summary", "Summary")} htmlFor="summary" required error={errors.summary?.message} description={`${values.summary?.length ?? 0}/500`}>
          <Textarea id="summary" rows={3} {...register("summary")} />
        </FormField>
        <FormField label={t("content.body", "Content")} error={errors.body?.message as string | undefined}>
          <ContentEditor key="create" value={values.body} onChange={(document) => setValue("body", document, { shouldDirty: true, shouldValidate: true })} invalid={!!errors.body} />
        </FormField>
      </FormSection>
    );
  }

  const { draftForm, version, activeVersionId, activeLanguage, setActiveLanguage, isVersionEditable, onSaveDraft, isSavingDraft, draftError } = workspace;

  if (!activeVersionId) {
    return <p className="text-sm text-muted-foreground">{t("content.selectVersionFirst", "Select a version from the Versions tab to start editing.")}</p>;
  }

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = draftForm;
  const values = watch();

  return (
    <Form form={draftForm} onSubmit={onSaveDraft} className="flex flex-col gap-6">
      {version && version.localizations.length > 1 ? (
        <FormField label={t("content.language", "Language")}>
          <Select value={activeLanguage} onValueChange={setActiveLanguage} options={version.localizations.map((localization) => ({ value: localization.culture, label: localization.culture }))} className="w-40" />
        </FormField>
      ) : null}

      {!isVersionEditable ? (
        <p className="rounded-md border border-warning/40 bg-warning/10 p-3 text-sm text-warning-foreground">
          {t("content.versionNotEditable", "This version is no longer editable (published or archived). Start a new draft version from the Versions tab to keep editing.")}
        </p>
      ) : null}

      <FormSection title={t("content.writing", "Writing")}>
        <FormField label={t("content.titleField", "Title")} htmlFor="title" required error={errors.title?.message}>
          <Input id="title" invalid={!!errors.title} disabled={!isVersionEditable} {...register("title")} />
        </FormField>
        <FormField label={t("content.summary", "Summary")} htmlFor="summary" required error={errors.summary?.message} description={`${values.summary?.length ?? 0}/500`}>
          <Textarea id="summary" rows={3} disabled={!isVersionEditable} {...register("summary")} />
        </FormField>
        <FormField label={t("content.body", "Content")} error={errors.body?.message as string | undefined}>
          <ContentEditor
            key={`${activeVersionId}:${activeLanguage}`}
            value={values.body}
            onChange={(document) => setValue("body", document, { shouldDirty: true, shouldValidate: true })}
            invalid={!!errors.body}
            readOnly={!isVersionEditable}
          />
        </FormField>
      </FormSection>

      {isVersionEditable ? (
        <div className="flex items-center gap-3">
          <Button type="submit" loading={isSavingDraft}>
            {t("content.saveDraft", "Save draft")}
          </Button>
          {draftError ? (
            <p role="alert" className="text-sm text-destructive">
              {draftError}
            </p>
          ) : null}
        </div>
      ) : null}
    </Form>
  );
}
