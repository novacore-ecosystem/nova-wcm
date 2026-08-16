"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAppForm } from "@/shared/forms";
import { slugify } from "@/shared/lib/slugify";
import {
  useCreateWebsitePageMutation,
  useUpdateWebsitePageMutation,
  useWebsitePageQuery,
} from "@/features/website-page/api/website-page.queries";
import { websitePageSchema, type WebsitePageFormValues } from "@/features/website-page/website-page.schema";

const EMPTY_VALUES: WebsitePageFormValues = { title: "", slug: "", content: "", seoTitle: "", seoDescription: "" };

export function useWebsitePageFormPage(pageId?: string) {
  const router = useRouter();
  const isEditMode = !!pageId;
  const pageQuery = useWebsitePageQuery(pageId);
  const createMutation = useCreateWebsitePageMutation();
  const updateMutation = useUpdateWebsitePageMutation();

  const form = useAppForm(websitePageSchema, { defaultValues: EMPTY_VALUES });
  const [slugTouched, setSlugTouched] = useState(isEditMode);

  useEffect(() => {
    if (pageQuery.data) {
      form.reset({
        title: pageQuery.data.title,
        slug: pageQuery.data.slug,
        content: pageQuery.data.content,
        seoTitle: pageQuery.data.seoTitle ?? "",
        seoDescription: pageQuery.data.seoDescription ?? "",
      });
      setSlugTouched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resync only when the loaded row identity changes
  }, [pageQuery.data]);

  const title = form.watch("title");
  useEffect(() => {
    if (!slugTouched) form.setValue("slug", slugify(title || ""), { shouldValidate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only title should re-derive the slug
  }, [title]);

  function handleSlugChange() {
    setSlugTouched(true);
  }

  async function onSubmit(values: WebsitePageFormValues) {
    const input = {
      title: values.title,
      slug: values.slug,
      content: values.content,
      seoTitle: values.seoTitle || undefined,
      seoDescription: values.seoDescription || undefined,
    };
    if (isEditMode && pageId) {
      await updateMutation.mutateAsync({ id: pageId, input });
    } else {
      await createMutation.mutateAsync(input);
    }
    router.push("/website/pages");
  }

  return {
    isEditMode,
    isLoading: isEditMode && pageQuery.isLoading,
    isError: isEditMode && pageQuery.isError,
    refetch: pageQuery.refetch,
    form,
    onSubmit,
    handleSlugChange,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}
