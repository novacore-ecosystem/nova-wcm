"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import {
  Button,
  ErrorState,
  FormActions,
  FormField,
  FormSection,
  Input,
  PageContainer,
  PageHeader,
  Select,
  SkeletonList,
  Textarea,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useProductCategoryForm } from "@/features/product-category/components/ProductCategoryForm/useProductCategoryForm";

export function ProductCategoryForm({ categoryId }: { categoryId?: string }) {
  const { t } = useAppTranslation();
  const { form, isEdit, isLoading, isLoadError, isSubmitting, errorMessage, onSubmit, markSlugTouched } =
    useProductCategoryForm(categoryId);
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const slugField = register("slug");

  if (isLoading) {
    return (
      <PageContainer>
        <SkeletonList rows={4} />
      </PageContainer>
    );
  }

  if (isLoadError) {
    return (
      <PageContainer>
        <ErrorState description={t("catalog.categories.loadError", "Could not load this category.")} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={isEdit ? t("catalog.categories.editTitle", "Edit category") : t("catalog.categories.newTitle", "Add category")}
          description={t("catalog.categories.formDescription", "Give it a clear name customers will recognize.")}
        />

        <Form form={form} onSubmit={onSubmit} className="grid max-w-2xl gap-6">
          <FormSection>
            <FormField label={t("catalog.categories.name", "Name")} htmlFor="name" required error={errors.name?.message}>
              <Input id="name" invalid={!!errors.name} {...register("name")} />
            </FormField>

            <FormField
              label={t("catalog.categories.slug", "Slug")}
              htmlFor="slug"
              required
              description={t("catalog.categories.slugHelp", "Used in the category's web address. Auto-filled from the name.")}
              error={errors.slug?.message}
            >
              <Input
                id="slug"
                invalid={!!errors.slug}
                {...slugField}
                onChange={(event) => {
                  markSlugTouched();
                  void slugField.onChange(event);
                }}
              />
            </FormField>

            <FormField
              label={t("catalog.categories.description", "Description")}
              htmlFor="description"
              error={errors.description?.message}
            >
              <Textarea id="description" rows={3} {...register("description")} />
            </FormField>

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <FormField label={t("catalog.categories.status", "Status")} htmlFor="status">
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    options={[
                      { value: "active", label: t("catalog.categories.active", "Active") },
                      { value: "inactive", label: t("catalog.categories.inactive", "Inactive") },
                    ]}
                  />
                </FormField>
              )}
            />
          </FormSection>

          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FormActions>
            <Button type="button" variant="outline" asChild>
              <Link href="/catalog/categories">{t("catalog.categories.cancel", "Cancel")}</Link>
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t("catalog.categories.save", "Save")}
            </Button>
          </FormActions>
        </Form>
      </div>
    </PageContainer>
  );
}
