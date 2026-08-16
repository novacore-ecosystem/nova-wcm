"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HttpError } from "@novacore/frontend-foundation";

import { useAppForm } from "@/shared/forms";
import { slugify } from "@/shared/lib/slugify";
import {
  articleCategorySchema,
  type ArticleCategoryFormValues,
} from "@/features/article-category/article-category.schema";
import {
  useArticleCategoryQuery,
  useCreateArticleCategoryMutation,
  useUpdateArticleCategoryMutation,
} from "@/features/article-category/api/article-category.queries";

const DEFAULT_VALUES: ArticleCategoryFormValues = { name: "", slug: "", description: "", status: "active" };

export function useArticleCategoryForm(categoryId?: string) {
  const router = useRouter();
  const isEditing = !!categoryId;
  const existing = useArticleCategoryQuery(categoryId ?? "");
  const [slugTouched, setSlugTouched] = useState(false);

  const form = useAppForm(articleCategorySchema, { defaultValues: DEFAULT_VALUES });
  const createMutation = useCreateArticleCategoryMutation();
  const updateMutation = useUpdateArticleCategoryMutation(categoryId ?? "");
  const mutation = isEditing ? updateMutation : createMutation;

  useEffect(() => {
    if (existing.data) {
      form.reset({
        name: existing.data.name,
        slug: existing.data.slug,
        description: existing.data.description ?? "",
        status: existing.data.status,
      });
      setSlugTouched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing.data]);

  function onNameChange(name: string) {
    form.setValue("name", name);
    if (!slugTouched) form.setValue("slug", slugify(name));
  }

  function onSlugChange(slug: string) {
    setSlugTouched(true);
    form.setValue("slug", slug);
  }

  const onSubmit = async (values: ArticleCategoryFormValues) => {
    await mutation.mutateAsync(values);
    router.push("/content/categories");
  };

  const errorMessage = mutation.error instanceof HttpError ? mutation.error.message : mutation.error ? "Something went wrong" : null;

  return {
    form,
    onSubmit,
    onNameChange,
    onSlugChange,
    isEditing,
    isLoadingExisting: isEditing && existing.isLoading,
    isSubmitting: mutation.isPending,
    errorMessage,
  };
}
