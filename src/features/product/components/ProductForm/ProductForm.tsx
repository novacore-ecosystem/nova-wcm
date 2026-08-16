"use client";

import Link from "next/link";
import { Controller } from "react-hook-form";
import {
  Button,
  ErrorState,
  FormActions,
  FormField,
  FormSection,
  HowTo,
  Input,
  PageContainer,
  PageHeader,
  Select,
  SkeletonList,
  Switch,
  Textarea,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useProductForm } from "@/features/product/components/ProductForm/useProductForm";

export function ProductForm({ productId }: { productId?: string }) {
  const { t } = useAppTranslation();
  const {
    form,
    isEdit,
    isLoading,
    isLoadError,
    isSubmitting,
    errorMessage,
    onSubmit,
    markSlugTouched,
    categoryOptions,
    coverImagePreviewUrl,
  } = useProductForm(productId);
  const {
    register,
    control,
    formState: { errors },
  } = form;
  const slugField = register("slug");

  if (isLoading) {
    return (
      <PageContainer>
        <SkeletonList rows={6} />
      </PageContainer>
    );
  }

  if (isLoadError) {
    return (
      <PageContainer>
        <ErrorState description={t("catalog.products.loadError", "Could not load this product.")} />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={isEdit ? t("catalog.products.editTitle", "Edit product") : t("catalog.products.newTitle", "Add product")}
          description={t("catalog.products.formDescription", "A clear name, a good photo, and one category is all you need to get started.")}
        />

        <HowTo title={t("catalog.products.howToTitle", "How to add a product")}>
          {t(
            "catalog.products.howToBody",
            "Use a good, well-lit photo — it's the first thing customers notice. Keep the description short and clear. Pick one category that best fits the product. Publish only when everything looks ready.",
          )}
        </HowTo>

        <Form form={form} onSubmit={onSubmit} className="grid max-w-3xl gap-8">
          <FormSection title={t("catalog.products.basicInfo", "Basic information")}>
            <FormField label={t("catalog.products.name", "Name")} htmlFor="name" required error={errors.name?.message}>
              <Input id="name" invalid={!!errors.name} {...register("name")} />
            </FormField>

            <FormField
              label={t("catalog.products.slug", "Slug")}
              htmlFor="slug"
              required
              description={t("catalog.products.slugHelp", "Used in the product's web address. Auto-filled from the name.")}
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

            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <FormField
                  label={t("catalog.products.category", "Category")}
                  htmlFor="categoryId"
                  required
                  error={errors.categoryId?.message}
                >
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={t("catalog.products.categoryPlaceholder", "Select a category")}
                    options={categoryOptions.map((category) => ({ value: category.id, label: category.name }))}
                  />
                </FormField>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="featured"
                render={({ field }) => (
                  <FormField label={t("catalog.products.featured", "Featured")} htmlFor="featured">
                    <div className="flex h-9 items-center gap-2">
                      <Switch id="featured" checked={field.value} onCheckedChange={field.onChange} />
                      <span className="text-sm text-muted-foreground">
                        {t("catalog.products.featuredHelp", "Show on the homepage highlights")}
                      </span>
                    </div>
                  </FormField>
                )}
              />

              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <FormField label={t("catalog.products.status", "Status")} htmlFor="status">
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={[
                        { value: "draft", label: t("catalog.products.draft", "Draft") },
                        { value: "published", label: t("catalog.products.published", "Published") },
                      ]}
                    />
                  </FormField>
                )}
              />
            </div>
          </FormSection>

          <FormSection
            title={t("catalog.products.descriptionSection", "Description")}
            description={t("catalog.products.descriptionSectionHelp", "What is it, and why would a customer want it?")}
          >
            <FormField
              label={t("catalog.products.shortDescription", "Short description")}
              htmlFor="shortDescription"
              description={t("catalog.products.shortDescriptionHelp", "Shown in product lists — aim for 1 sentence, under 160 characters.")}
              error={errors.shortDescription?.message}
            >
              <Textarea id="shortDescription" rows={2} invalid={!!errors.shortDescription} {...register("shortDescription")} />
            </FormField>

            <FormField
              label={t("catalog.products.longDescription", "Full description")}
              htmlFor="description"
              description={t("catalog.products.longDescriptionHelp", "Shown on the product page. Keep it clear and easy to scan.")}
              error={errors.description?.message}
            >
              <Textarea id="description" rows={6} invalid={!!errors.description} {...register("description")} />
            </FormField>
          </FormSection>

          <FormSection
            title={t("catalog.products.seo", "SEO")}
            description={t("catalog.products.seoHelp", "Optional. Helps this product show up well in search results.")}
          >
            <FormField
              label={t("catalog.products.seoTitle", "SEO title")}
              htmlFor="seoTitle"
              description={t("catalog.products.seoTitleHelp", "Up to 60 characters — shown as the page title in search results.")}
              error={errors.seoTitle?.message}
            >
              <Input id="seoTitle" invalid={!!errors.seoTitle} {...register("seoTitle")} />
            </FormField>

            <FormField
              label={t("catalog.products.seoDescription", "SEO description")}
              htmlFor="seoDescription"
              description={t("catalog.products.seoDescriptionHelp", "Up to 160 characters — shown as the snippet in search results.")}
              error={errors.seoDescription?.message}
            >
              <Textarea id="seoDescription" rows={2} invalid={!!errors.seoDescription} {...register("seoDescription")} />
            </FormField>
          </FormSection>

          <FormSection title={t("catalog.products.image", "Image")}>
            <FormField
              label={t("catalog.products.coverImageUrl", "Cover image URL")}
              htmlFor="coverImageUrl"
              description={t("catalog.products.coverImageHelp", "Upload real images from the Media Library once available.")}
              error={errors.coverImageUrl?.message}
            >
              <Input id="coverImageUrl" invalid={!!errors.coverImageUrl} {...register("coverImageUrl")} />
            </FormField>

            {coverImagePreviewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary external preview URL, not part of Next's optimized image pipeline yet
              <img
                src={coverImagePreviewUrl}
                alt={t("catalog.products.coverImagePreviewAlt", "Cover image preview")}
                className="h-40 w-auto rounded-lg border border-border object-cover"
              />
            ) : null}
          </FormSection>

          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FormActions>
            <Button type="button" variant="outline" asChild>
              <Link href="/catalog/products">{t("catalog.products.cancel", "Cancel")}</Link>
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t("catalog.products.save", "Save")}
            </Button>
          </FormActions>
        </Form>
      </div>
    </PageContainer>
  );
}
