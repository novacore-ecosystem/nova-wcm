"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criteriaSort } from "@novacore/frontend-foundation";
import { fromPaginatedResult, useDebouncedValue, type DataTableSortState } from "@novacore/frontend-next-shadcn";

import { useArticleCategoriesQuery, useDeleteArticleCategoryMutation } from "@/features/article-category/api/article-category.queries";

export function useArticleCategoryListPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sorting, setSorting] = useState<DataTableSortState | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const debouncedKeyword = useDebouncedValue(keyword);
  const deleteMutation = useDeleteArticleCategoryMutation();

  const query = useArticleCategoriesQuery({
    keyword: debouncedKeyword || undefined,
    sorts: sorting ? [criteriaSort(sorting.columnId, sorting.direction)] : [],
    page,
    pageSize,
  });

  const table = query.data ? fromPaginatedResult(query.data) : undefined;

  return {
    keyword,
    setKeyword: (value: string) => {
      setKeyword(value);
      setPage(1);
    },
    sorting,
    setSorting: (value: DataTableSortState | undefined) => setSorting(value),
    data: table?.data ?? [],
    pagination: table?.pagination,
    onPaginationChange: (next: { pageNumber: number; pageSize: number }) => {
      setPage(next.pageNumber);
      setPageSize(next.pageSize);
    },
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    goToNew: () => router.push("/content/categories/new"),
    goToEdit: (id: string) => router.push(`/content/categories/${id}`),
    deleteTarget,
    openDeleteConfirm: (id: string, name: string) => setDeleteTarget({ id, name }),
    closeDeleteConfirm: () => setDeleteTarget(null),
    confirmDelete: async () => {
      if (!deleteTarget) return;
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    },
    deleteMutation,
  };
}
