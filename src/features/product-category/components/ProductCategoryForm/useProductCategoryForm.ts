"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppForm } from "@/shared/forms";
import {
  useCreateProductCategoryMutation,
  useProductCategoryQuery,
  useUpdateProductCategoryMutation,
} from "@/features/product-category/api/product-category.queries";
import { productCategorySchema, type ProductCategoryFormValues } from "@/features/product-category/product-category.schema";
import { slugify } from "@/features/product-category/lib/slugify";

export function useProductCategoryForm(categoryId?: string) {
  const router = useRouter();
  const isEdit = !!categoryId;
  const [slugTouched, setSlugTouched] = useState(false);

  const categoryQuery = useProductCategoryQuery(categoryId ?? "");
  const createMutation = useCreateProductCategoryMutation();
  const updateMutation = useUpdateProductCategoryMutation(categoryId ?? "");
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useAppForm(productCategorySchema, {
    defaultValues: { name: "", slug: "", description: "", status: "active" },
  });

  const { reset, setValue, watch } = form;

  useEffect(() => {
    if (!categoryQuery.data) return;
    reset({
      name: categoryQuery.data.name,
      slug: categoryQuery.data.slug,
      description: categoryQuery.data.description ?? "",
      status: categoryQuery.data.status,
    });
  }, [categoryQuery.data, reset]);

  const nameValue = watch("name");
  useEffect(() => {
    if (isEdit || slugTouched) return;
    setValue("slug", slugify(nameValue ?? ""));
  }, [nameValue, isEdit, slugTouched, setValue]);

  async function onSubmit(values: ProductCategoryFormValues) {
    await mutation.mutateAsync(values);
    router.push("/catalog/categories");
  }

  return {
    form,
    isEdit,
    isLoading: isEdit && categoryQuery.isLoading,
    isLoadError: isEdit && categoryQuery.isError,
    isSubmitting: mutation.isPending,
    errorMessage: mutation.isError ? "Could not save this category. Try again." : null,
    onSubmit,
    markSlugTouched: () => setSlugTouched(true),
  };
}
