"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppForm } from "@/shared/forms";
import { useAllProductCategoriesQuery } from "@/features/product-category";
import { useCreateProductMutation, useProductQuery, useUpdateProductMutation } from "@/features/product/api/product.queries";
import { productSchema, type ProductFormValues } from "@/features/product/product.schema";
import { slugify } from "@/features/product/lib/slugify";

export function useProductForm(productId?: string) {
  const router = useRouter();
  const isEdit = !!productId;
  const [slugTouched, setSlugTouched] = useState(false);

  const productQuery = useProductQuery(productId ?? "");
  const categoriesQuery = useAllProductCategoriesQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation(productId ?? "");
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useAppForm(productSchema, {
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      featured: false,
      status: "draft",
      shortDescription: "",
      description: "",
      seoTitle: "",
      seoDescription: "",
      coverImageUrl: "",
    },
  });
  const { reset, setValue, watch } = form;

  useEffect(() => {
    if (!productQuery.data) return;
    reset({
      name: productQuery.data.name,
      slug: productQuery.data.slug,
      categoryId: productQuery.data.categoryId,
      featured: productQuery.data.featured,
      status: productQuery.data.status,
      shortDescription: productQuery.data.shortDescription ?? "",
      description: productQuery.data.description ?? "",
      seoTitle: productQuery.data.seoTitle ?? "",
      seoDescription: productQuery.data.seoDescription ?? "",
      coverImageUrl: productQuery.data.coverImageUrl ?? "",
    });
  }, [productQuery.data, reset]);

  const nameValue = watch("name");
  useEffect(() => {
    if (isEdit || slugTouched) return;
    setValue("slug", slugify(nameValue ?? ""));
  }, [nameValue, isEdit, slugTouched, setValue]);

  const coverImagePreviewUrl = watch("coverImageUrl");

  async function onSubmit(values: ProductFormValues) {
    await mutation.mutateAsync(values);
    router.push("/catalog/products");
  }

  return {
    form,
    isEdit,
    isLoading: isEdit && productQuery.isLoading,
    isLoadError: isEdit && productQuery.isError,
    isSubmitting: mutation.isPending,
    errorMessage: mutation.isError ? "Could not save this product. Try again." : null,
    onSubmit,
    markSlugTouched: () => setSlugTouched(true),
    categoryOptions: categoriesQuery.data ?? [],
    coverImagePreviewUrl,
  };
}
