"use client";

import { useEffect, useState } from "react";

import { useAppForm } from "@/shared/forms";
import {
  useAiContextGroupsQuery,
  useCreateAiContextGroupMutation,
  useDeleteAiContextGroupMutation,
  usePersonalAiContextQuery,
  useUpdateAiContextGroupMutation,
  useUpdatePersonalAiContextMutation,
} from "@/features/ai-context/api/ai-context.queries";
import { aiContextGroupSchema, personalAiContextSchema, type AiContextGroupFormValues, type PersonalAiContextFormValues } from "@/features/ai-context/ai-context.schema";
import type { AiContextGroup } from "@/services/ai-context";

const EMPTY_GROUP: AiContextGroupFormValues = { name: "", category: "general", scope: "global", content: "" };

export function useAiContextPage() {
  const groupsQuery = useAiContextGroupsQuery();
  const personalQuery = usePersonalAiContextQuery();

  const createMutation = useCreateAiContextGroupMutation();
  const updateMutation = useUpdateAiContextGroupMutation();
  const deleteMutation = useDeleteAiContextGroupMutation();
  const updatePersonalMutation = useUpdatePersonalAiContextMutation();

  const [editingGroup, setEditingGroup] = useState<AiContextGroup | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const groupForm = useAppForm(aiContextGroupSchema, { defaultValues: EMPTY_GROUP });
  const [deleteTarget, setDeleteTarget] = useState<AiContextGroup | null>(null);

  function openCreate() {
    setEditingGroup(null);
    groupForm.reset(EMPTY_GROUP);
    setSheetOpen(true);
  }

  function openEdit(group: AiContextGroup) {
    setEditingGroup(group);
    groupForm.reset({ name: group.name, category: group.category, scope: group.scope, content: group.content });
    setSheetOpen(true);
  }

  async function submitGroup(values: AiContextGroupFormValues) {
    if (editingGroup) {
      await updateMutation.mutateAsync({ id: editingGroup.id, patch: values });
    } else {
      await createMutation.mutateAsync({
        id: `ctx-${crypto.randomUUID()}`,
        ...values,
        assignedCount: 0,
        updatedAt: new Date().toISOString(),
      });
    }
    setSheetOpen(false);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }

  const personalForm = useAppForm(personalAiContextSchema, { defaultValues: { content: "" } });
  useEffect(() => {
    if (personalQuery.data) personalForm.reset({ content: personalQuery.data.content });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalQuery.data]);

  async function submitPersonal(values: PersonalAiContextFormValues) {
    await updatePersonalMutation.mutateAsync(values.content ?? "");
  }

  const groups = groupsQuery.data ?? [];
  const globalGroups = groups.filter((group) => group.scope === "global");
  const teamGroups = groups.filter((group) => group.scope === "group");

  return {
    groupsQuery,
    groups,
    globalGroups,
    teamGroups,
    sheetOpen,
    setSheetOpen,
    editingGroup,
    openCreate,
    openEdit,
    groupForm,
    submitGroup,
    isSavingGroup: createMutation.isPending || updateMutation.isPending,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting: deleteMutation.isPending,
    personalForm,
    submitPersonal,
    isSavingPersonal: updatePersonalMutation.isPending,
    personalContent: personalQuery.data?.content ?? "",
  };
}
