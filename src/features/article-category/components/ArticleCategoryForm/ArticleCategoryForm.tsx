"use client";

import Link from "next/link";
import {
  Button,
  FormActions,
  FormField,
  FormSection,
  Input,
  LoadingState,
  PageContainer,
  PageHeader,
  Select,
  Textarea,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useArticleCategoryForm } from "@/features/article-category/components/ArticleCategoryForm/useArticleCategoryForm";

export function ArticleCategoryForm({ categoryId }: { categoryId?: string }) {
  const { t } = useAppTranslation();
  const { form, onSubmit, onNameChange, onSlugChange, isEditing, isLoadingExisting, isSubmitting, errorMessage } =
    useArticleCategoryForm(categoryId);

  if (isLoadingExisting) return <LoadingState />;

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  return (
    <PageContainer>
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <PageHeader
          title={isEditing ? t("articleCategory.editTitle", "Edit category") : t("articleCategory.newTitle", "New category")}
          description={t("articleCategory.formDescription", "A short, clear name works best — this becomes part of your article URLs.")}
        />

        <Form form={form} onSubmit={onSubmit} className="grid gap-6">
          <FormSection>
            <FormField label={t("articleCategory.name", "Name")} htmlFor="name" required error={errors.name?.message}>
              <Input id="name" invalid={!!errors.name} {...register("name")} onChange={(e) => onNameChange(e.target.value)} value={watch("name")} />
            </FormField>
            <FormField
              label={t("articleCategory.slug", "Slug")}
              htmlFor="slug"
              required
              description={t("articleCategory.slugHelp", "Shown in the article URL, e.g. /blog/" + (watch("slug") || "category-slug"))}
              error={errors.slug?.message}
            >
              <Input id="slug" invalid={!!errors.slug} {...register("slug")} onChange={(e) => onSlugChange(e.target.value)} value={watch("slug")} />
            </FormField>
            <FormField label={t("articleCategory.description", "Description")} htmlFor="description" error={errors.description?.message}>
              <Textarea id="description" rows={3} {...register("description")} />
            </FormField>
            <FormField label={t("articleCategory.status", "Status")} htmlFor="status">
              <Select
                value={watch("status")}
                onValueChange={(value) => form.setValue("status", value as "active" | "inactive")}
                options={[
                  { value: "active", label: t("articleCategory.active", "Active") },
                  { value: "inactive", label: t("articleCategory.inactive", "Inactive") },
                ]}
              />
            </FormField>
          </FormSection>

          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FormActions>
            <Button variant="outline" type="button" asChild>
              <Link href="/content/categories">{t("common.cancel", "Cancel")}</Link>
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t("common.save", "Save")}
            </Button>
          </FormActions>
        </Form>
      </div>
    </PageContainer>
  );
}
