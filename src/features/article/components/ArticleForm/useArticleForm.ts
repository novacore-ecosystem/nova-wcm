"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HttpError } from "@novacore/frontend-foundation";

import { useAppForm } from "@/shared/forms";
import { slugify } from "@/shared/lib/slugify";
import { articleSchema, type ArticleFormValues } from "@/features/article/article.schema";
import { useArticleQuery, useCreateArticleMutation, useUpdateArticleMutation } from "@/features/article/api/article.queries";
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
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
};

export const ARTICLE_AUTHORS = ["Minh Anh", "Thu Hà", "Quốc Bảo"];

export function useArticleForm(articleId?: string) {
  const router = useRouter();
  const isEditing = !!articleId;
  const existing = useArticleQuery(articleId ?? "");
  const categories = useAllArticleCategoriesQuery();
  const tags = useAllTagsQuery();
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
        seoTitle: existing.data.seoTitle ?? "",
        seoDescription: existing.data.seoDescription ?? "",
        canonicalUrl: existing.data.canonicalUrl ?? "",
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
    categories: categories.data ?? [],
    tags: tags.data ?? [],
    isEditing,
    isLoadingExisting: isEditing && existing.isLoading,
    isSubmitting: mutation.isPending,
    errorMessage,
  };
}
