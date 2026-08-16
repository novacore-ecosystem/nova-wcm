"use client";

import Link from "next/link";
import { cn } from "@novacore/frontend-next-shadcn";
import {
  Button,
  FormActions,
  FormField,
  FormSection,
  HowTo,
  Input,
  LoadingState,
  PageContainer,
  PageHeader,
  Select,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { ARTICLE_AUTHORS, useArticleForm } from "@/features/article/components/ArticleForm/useArticleForm";
import { SeoResultPreview } from "@/features/article/components/ArticleForm/SeoResultPreview";
import { renderMarkdownLite } from "@/features/article/lib/renderMarkdownLite";

export function ArticleForm({ articleId }: { articleId?: string }) {
  const { t } = useAppTranslation();
  const { form, onSubmit, onTitleChange, onSlugChange, toggleTag, categories, tags, isEditing, isLoadingExisting, isSubmitting, errorMessage } =
    useArticleForm(articleId);

  if (isLoadingExisting) return <LoadingState />;

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const values = watch();

  return (
    <PageContainer>
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <PageHeader
          title={isEditing ? t("article.editTitle", "Edit article") : t("article.newTitle", "Write article")}
          description={t("article.formDescription", "Write for your reader first — a clear title and a helpful summary go a long way.")}
        />

        <Form form={form} onSubmit={onSubmit} className="grid gap-8">
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
              description={t("article.coverImageHelp", "Paste an image URL, or upload one from the Media Library once available.")}
              error={errors.coverImageUrl?.message}
            >
              <Input id="coverImageUrl" invalid={!!errors.coverImageUrl} {...register("coverImageUrl")} placeholder="https://…" />
            </FormField>
            {values.coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.coverImageUrl} alt="" className="h-40 w-full rounded-lg border border-border object-cover" />
            ) : null}
          </FormSection>

          <FormSection title={t("article.content", "Content")} description={t("article.contentDescription", "Write naturally — headings start a line with \"# \", bullet points with \"- \".")}>
            <Tabs defaultValue="write">
              <TabsList>
                <TabsTrigger value="write">{t("article.write", "Write")}</TabsTrigger>
                <TabsTrigger value="preview">{t("article.preview", "Preview")}</TabsTrigger>
              </TabsList>
              <TabsContent value="write">
                <Textarea rows={14} {...register("content")} className={cn(errors.content && "border-destructive")} />
                {errors.content ? <p className="mt-1.5 text-xs text-destructive">{errors.content.message}</p> : null}
              </TabsContent>
              <TabsContent value="preview">
                <div className="min-h-[280px] rounded-md border border-border p-4">{renderMarkdownLite(values.content || "")}</div>
              </TabsContent>
            </Tabs>
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
            <div className="flex items-center justify-between rounded-md border border-border p-3">
              <div>
                <p className="text-sm font-medium">{t("article.featured", "Featured")}</p>
                <p className="text-xs text-muted-foreground">{t("article.featuredHelp", "Highlight this article on the homepage.")}</p>
              </div>
              <Switch checked={values.featured} onCheckedChange={(checked) => form.setValue("featured", checked)} />
            </div>
          </FormSection>

          <FormSection title={t("article.seo", "SEO")} description={t("article.seoDescriptionHelp", "Help your article show up well in search results.")}>
            <FormField
              label={t("article.seoTitle", "Meta title")}
              htmlFor="seoTitle"
              description={t("article.seoTitleHelp", `${values.seoTitle?.length ?? 0}/70 — aim for 50-60 characters.`)}
              error={errors.seoTitle?.message}
            >
              <Input id="seoTitle" {...register("seoTitle")} placeholder={values.title} />
            </FormField>
            <FormField
              label={t("article.seoDescription", "Meta description")}
              htmlFor="seoDescription"
              description={t("article.seoDescriptionHelpText", `${values.seoDescription?.length ?? 0}/170 — aim for 150-160 characters.`)}
              error={errors.seoDescription?.message}
            >
              <Textarea id="seoDescription" rows={2} {...register("seoDescription")} placeholder={values.excerpt} />
            </FormField>
            <SeoResultPreview title={values.seoTitle || values.title} description={values.seoDescription || values.excerpt || ""} slug={values.slug} />
            <FormField
              label={t("article.canonicalUrl", "Canonical URL")}
              htmlFor="canonicalUrl"
              description={t("article.canonicalUrlHelp", "Optional — only needed if this article is also published elsewhere.")}
              error={errors.canonicalUrl?.message}
            >
              <Input id="canonicalUrl" {...register("canonicalUrl")} placeholder="https://…" />
            </FormField>
          </FormSection>

          <FormSection title={t("article.publishing", "Publishing")}>
            <FormField label={t("article.status", "Status")} htmlFor="status">
              <Select
                value={values.status}
                onValueChange={(value) => form.setValue("status", value as "draft" | "published")}
                options={[
                  { value: "draft", label: t("article.draft", "Draft") },
                  { value: "published", label: t("article.published", "Published") },
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
              <Link href="/content/articles">{t("common.cancel", "Cancel")}</Link>
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {values.status === "published" ? t("article.publish", "Publish") : t("common.saveDraft", "Save draft")}
            </Button>
          </FormActions>
        </Form>

        <HowTo title={t("article.howToTitle", "How to write an article that's ready for SEO")}>
          {t(
            "article.howToBody",
            "Use your main keyword naturally in the title and the first paragraph. Keep the meta title under 60 characters and the meta description under 160 — search engines cut off anything longer.",
          )}
        </HowTo>
      </div>
    </PageContainer>
  );
}
