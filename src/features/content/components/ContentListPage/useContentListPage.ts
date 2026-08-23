"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criteriaFilter, type CriteriaFilter } from "@novacore/frontend-foundation";

import { useAdminContentSearchQuery, useContentTypesQuery, useDeleteContentMutation, useRestoreContentMutation } from "@/features/content/api/content.queries";
import type { ContentStatus, ContentVisibility } from "@/services/content";

export type ContentStatusFilter = "all" | ContentStatus;
export type ContentVisibilityFilter = "all" | ContentVisibility;

const PAGE_SIZE = 20;

/** `CriteriaValueConverter` parses Enum-typed filter values via `Enum.Parse(type, value, ignoreCase: true)` on the PascalCase C# member name — the opposite convention from response bodies, which serialize the same enums as numeric ordinals (see `content.mappers.ts`). This app's `ContentStatus`/`ContentVisibility` unions were deliberately named to match those member names 1:1 once capitalized, so a plain capitalize is enough — no lookup table needed. */
function toEnumFilterValue(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Admin/WCM content list — real cursor-paginated `POST /contents/admin/search`. No keyword search
 * exists on the backend (`ContentCriteriaDefinition` only whitelists `contentTypeId`/`status`/
 * `visibility`/`createdAt`, no `.Keyword(...)` configured) — a search box would silently do
 * nothing, so this deliberately doesn't offer one.
 */
export function useContentListPage() {
  const router = useRouter();
  const [contentTypeId, setContentTypeIdState] = useState("all");
  const [status, setStatusState] = useState<ContentStatusFilter>("all");
  const [visibility, setVisibilityState] = useState<ContentVisibilityFilter>("all");
  const [createdFrom, setCreatedFromState] = useState("");
  const [createdTo, setCreatedToState] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; slug: string } | null>(null);

  const contentTypes = useContentTypesQuery();

  const filters: CriteriaFilter[] = [];
  if (contentTypeId !== "all") filters.push(criteriaFilter("contentTypeId", "eq", contentTypeId));
  if (status !== "all") filters.push(criteriaFilter("status", "eq", toEnumFilterValue(status)));
  if (visibility !== "all") filters.push(criteriaFilter("visibility", "eq", toEnumFilterValue(visibility)));
  if (createdFrom) filters.push(criteriaFilter("createdAt", "gte", new Date(createdFrom).toISOString()));
  if (createdTo) filters.push(criteriaFilter("createdAt", "lte", new Date(createdTo).toISOString()));

  const query = useAdminContentSearchQuery({ filters }, PAGE_SIZE);
  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  const deleteMutation = useDeleteContentMutation();
  const restoreMutation = useRestoreContentMutation();

  function resetAndSet<T>(setter: (value: T) => void) {
    return (value: T) => setter(value);
  }

  return {
    contentTypes: contentTypes.data ?? [],
    contentTypeId,
    setContentTypeId: resetAndSet(setContentTypeIdState),
    status,
    setStatus: resetAndSet(setStatusState),
    visibility,
    setVisibility: resetAndSet(setVisibilityState),
    createdFrom,
    setCreatedFrom: resetAndSet(setCreatedFromState),
    createdTo,
    setCreatedTo: resetAndSet(setCreatedToState),
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: () => void query.fetchNextPage(),
    goToNew: () => router.push("/content/articles/new"),
    goToEdit: (id: string) => router.push(`/content/articles/${id}`),
    deleteTarget,
    openDeleteConfirm: (id: string, slug: string) => setDeleteTarget({ id, slug }),
    closeDeleteConfirm: () => setDeleteTarget(null),
    confirmDelete: async () => {
      if (!deleteTarget) return;
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    },
    deleteMutation,
    restoreContent: (id: string) => restoreMutation.mutate(id),
    isRestoring: restoreMutation.isPending,
    restoringId: restoreMutation.isPending ? (restoreMutation.variables as string) : null,
  };
}
