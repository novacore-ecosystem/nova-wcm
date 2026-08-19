"use client";

import { cn } from "@novacore/frontend-next-shadcn";
import { FormField, FormSection, Input, Select, Textarea } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { ARTICLE_AUTHORS } from "@/features/article/components/ArticleWorkspace/useArticleForm";
import type { useArticleWorkspace } from "@/features/article/components/ArticleWorkspace/useArticleWorkspace";

export function InformationTab({ workspace }: { workspace: ReturnType<typeof useArticleWorkspace> }) {
  const { t } = useAppTranslation();
  const { form, onTitleChange, onSlugChange, toggleTag, categories, tags } = workspace;
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const values = watch();

  return (
    <div className="grid gap-6">
      <FormSection title={t("article.basicInfo", "Basic information")}>
        <FormField label={t("article.titleField", "Title")} htmlFor="title" required error={errors.title?.message}>
          <Input id="title" invalid={!!errors.title} {...register("title")} onChange={(e) => onTitleChange(e.target.value)} value={values.title} />
        </FormField>
        <FormField
          label={t("article.slug", "Slug")}
          htmlFor="slug"
          required
          description={t("article.slugHelp", "Shown in the article URL: /blog/" + (values.slug || "bai-viet"))}
          error={errors.slug?.message}
        >
          <Input id="slug" invalid={!!errors.slug} {...register("slug")} onChange={(e) => onSlugChange(e.target.value)} value={values.slug} />
        </FormField>
        <FormField
          label={t("article.excerpt", "Summary")}
          htmlFor="excerpt"
          description={t("article.excerptHelp", `${values.excerpt?.length ?? 0}/220 — shown in article lists and social shares.`)}
          error={errors.excerpt?.message}
        >
          <Textarea id="excerpt" rows={2} {...register("excerpt")} />
        </FormField>
        <FormField
          label={t("article.coverImage", "Cover image URL")}
          htmlFor="coverImageUrl"
          description={t("article.coverImageHelp", "Paste an image URL, or pick one from the Media Library.")}
          error={errors.coverImageUrl?.message}
        >
          <Input id="coverImageUrl" invalid={!!errors.coverImageUrl} {...register("coverImageUrl")} placeholder="https://…" />
        </FormField>
        {values.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- external cover image URLs, next.config.ts image domains not modifiable here
          <img src={values.coverImageUrl} alt="" className="h-40 w-full rounded-lg border border-border object-cover" />
        ) : null}
      </FormSection>

      <FormSection title={t("article.classification", "Classification")}>
        <FormField label={t("article.category", "Category")} htmlFor="categoryId">
          <Select
            value={values.categoryId || undefined}
            onValueChange={(value) => form.setValue("categoryId", value)}
            placeholder={t("article.categoryPlaceholder", "Select a category")}
            options={categories.map((category) => ({ value: category.id, label: category.name }))}
          />
        </FormField>
        <FormField label={t("article.tags", "Tags")}>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const selected = values.tagIds.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    selected ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent",
                  )}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </FormField>
        <FormField label={t("article.author", "Author")} htmlFor="author" required error={errors.author?.message}>
          <Select
            value={values.author || undefined}
            onValueChange={(value) => form.setValue("author", value)}
            placeholder={t("article.authorPlaceholder", "Select an author")}
            options={ARTICLE_AUTHORS.map((author) => ({ value: author, label: author }))}
          />
        </FormField>
      </FormSection>
    </div>
  );
}
