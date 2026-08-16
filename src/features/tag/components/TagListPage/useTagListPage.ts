"use client";

import { useState } from "react";
import { useDebouncedValue } from "@novacore/frontend-next-shadcn";

import { useAppForm } from "@/shared/forms";
import { slugify } from "@/shared/lib/slugify";
import { tagSchema, type TagFormValues } from "@/features/tag/tag.schema";
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useTagsQuery,
  useUpdateTagMutation,
} from "@/features/tag/api/tag.queries";
import type { Tag } from "@/services/tag";

export function useTagListPage() {
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const query = useTagsQuery({ keyword: debouncedKeyword || undefined, pageSize: 100 });
  const createMutation = useCreateTagMutation();
  const updateMutation = useUpdateTagMutation();
  const deleteMutation = useDeleteTagMutation();

  const form = useAppForm(tagSchema, { defaultValues: { name: "", slug: "" } });
  const mutation = editing ? updateMutation : createMutation;

  function openCreate() {
    setEditing(null);
    setSlugTouched(false);
    form.reset({ name: "", slug: "" });
    setDialogOpen(true);
  }

  function openEdit(tag: Tag) {
    setEditing(tag);
    setSlugTouched(true);
    form.reset({ name: tag.name, slug: tag.slug });
    setDialogOpen(true);
  }

  function onNameChange(name: string) {
    form.setValue("name", name);
    if (!slugTouched) form.setValue("slug", slugify(name));
  }

  const onSubmit = async (values: TagFormValues) => {
    if (editing) await updateMutation.mutateAsync({ id: editing.id, values });
    else await createMutation.mutateAsync(values);
    setDialogOpen(false);
  };

  return {
    keyword,
    setKeyword,
    data: query.data?.items ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    dialogOpen,
    setDialogOpen,
    openCreate,
    openEdit,
    onNameChange,
    onSubmit,
    form,
    isEditing: !!editing,
    isSubmitting: mutation.isPending,
    deleteTarget,
    openDeleteConfirm: setDeleteTarget,
    closeDeleteConfirm: () => setDeleteTarget(null),
    confirmDelete: async () => {
      if (!deleteTarget) return;
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    },
    deleteMutation,
  };
}
