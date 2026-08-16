"use client";

import { useMemo, useState } from "react";
import { useDebouncedValue, type DataTablePaginationState } from "@novacore/frontend-next-shadcn";
import type { CriteriaRequest } from "@novacore/frontend-foundation";

import {
  useDeleteWebsitePageMutation,
  useSetWebsitePageStatusMutation,
  useWebsitePagesQuery,
} from "@/features/website-page/api/website-page.queries";
import type { WebsitePage } from "@/services/website-page";

export function useWebsitePageListPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [pagination, setPagination] = useState<DataTablePaginationState>({ pageNumber: 1, pageSize: 10, totalRows: 0 });

  const criteriaRequest = useMemo<CriteriaRequest>(
    () => ({ keyword: debouncedSearch, page: pagination.pageNumber, pageSize: pagination.pageSize }),
    [debouncedSearch, pagination.pageNumber, pagination.pageSize],
  );

  const pagesQuery = useWebsitePagesQuery(criteriaRequest);
  const setStatusMutation = useSetWebsitePageStatusMutation();
  const deleteMutation = useDeleteWebsitePageMutation();

  const [deleteTarget, setDeleteTarget] = useState<WebsitePage | null>(null);

  function togglePublish(row: WebsitePage) {
    setStatusMutation.mutate({ id: row.id, status: row.status === "published" ? "draft" : "published" });
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }

  return {
    search,
    setSearch,
    pagination: pagesQuery.data
      ? { pageNumber: pagesQuery.data.pageNumber, pageSize: pagesQuery.data.pageSize, totalRows: pagesQuery.data.totalCount }
      : pagination,
    setPagination,
    pagesQuery,
    togglePublish,
    isTogglingStatus: setStatusMutation.isPending,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting: deleteMutation.isPending,
  };
}
