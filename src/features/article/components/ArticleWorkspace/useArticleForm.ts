"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HttpError } from "@novacore/frontend-foundation";

import { useAppForm } from "@/shared/forms";
import { slugify } from "@/shared/lib/slugify";
import { articleSchema, type ArticleFormValues } from "@/features/article/article.schema";
import { useAllArticlesQuery, useArticleQuery, useCreateArticleMutation, useUpdateArticleMutation } from "@/features/article/api/article.queries";
import { useAllArticleCategoriesQuery } from "@/features/article-category/api/article-category.queries";
import { useAllTagsQuery } from "@/features/tag/api/tag.queries";

const DEFAULT_VALUES: ArticleFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  categoryId: "",
  tagIds: [],
  author: "",
  featured: false,
  status: "draft",
  publishedAt: "",
  scheduledAt: "",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  relatedArticleIds: [],
};

export const ARTICLE_AUTHORS = ["Minh Anh", "Thu Hà", "Quốc Bảo"];

/** Core form/data logic for the article workspace — RHF state, load/save, classification helpers. Tab layout and AI state live in `useArticleWorkspace`. */
export function useArticleForm(articleId?: string) {
  const router = useRouter();
  const isEditing = !!articleId;
  const existing = useArticleQuery(articleId ?? "");
  const categories = useAllArticleCategoriesQuery();
  const tags = useAllTagsQuery();
  const allArticles = useAllArticlesQuery();
  const [slugTouched, setSlugTouched] = useState(false);

  const form = useAppForm(articleSchema, { defaultValues: DEFAULT_VALUES });
  const createMutation = useCreateArticleMutation();
  const updateMutation = useUpdateArticleMutation(articleId ?? "");
  const mutation = isEditing ? updateMutation : createMutation;

  useEffect(() => {
    if (existing.data) {
      form.reset({
        title: existing.data.title,
        slug: existing.data.slug,
        excerpt: existing.data.excerpt,
        content: existing.data.content,
        coverImageUrl: existing.data.coverImageUrl ?? "",
        categoryId: existing.data.categoryId ?? "",
        tagIds: existing.data.tagIds,
        author: existing.data.author,
        featured: existing.data.featured,
        status: existing.data.status,
        publishedAt: existing.data.publishedAt ?? "",
        scheduledAt: existing.data.scheduledAt ?? "",
        seoTitle: existing.data.seoTitle ?? "",
        seoDescription: existing.data.seoDescription ?? "",
        canonicalUrl: existing.data.canonicalUrl ?? "",
        relatedArticleIds: existing.data.relatedArticleIds ?? [],
      });
      setSlugTouched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing.data]);

  function onTitleChange(title: string) {
    form.setValue("title", title);
    if (!slugTouched) form.setValue("slug", slugify(title));
  }

  function onSlugChange(slug: string) {
    setSlugTouched(true);
    form.setValue("slug", slug);
  }

  function toggleTag(tagId: string) {
    const current = form.getValues("tagIds");
    form.setValue("tagIds", current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId]);
  }

  function toggleRelatedArticle(id: string) {
    const current = form.getValues("relatedArticleIds");
    form.setValue("relatedArticleIds", current.includes(id) ? current.filter((relatedId) => relatedId !== id) : [...current, id]);
  }

  const onSubmit = async (values: ArticleFormValues) => {
    await mutation.mutateAsync(values);
    router.push("/content/articles");
  };

  const errorMessage = mutation.error instanceof HttpError ? mutation.error.message : mutation.error ? "Something went wrong" : null;

  return {
    form,
    onSubmit,
    onTitleChange,
    onSlugChange,
    toggleTag,
    toggleRelatedArticle,
    categories: categories.data ?? [],
    tags: tags.data ?? [],
    otherArticles: (allArticles.data ?? []).filter((article) => article.id !== articleId),
    isEditing,
    isLoadingExisting: isEditing && existing.isLoading,
    isSubmitting: mutation.isPending,
    errorMessage,
  };
}
