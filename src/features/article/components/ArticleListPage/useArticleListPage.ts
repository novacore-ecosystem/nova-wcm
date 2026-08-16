"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { criteriaFilter, criteriaSort, type CriteriaFilter } from "@novacore/frontend-foundation";
import { fromPaginatedResult, useDebouncedValue, type DataTableSortState } from "@novacore/frontend-next-shadcn";

import { useArticlesQuery, useDeleteArticleMutation } from "@/features/article/api/article.queries";
import { useAllArticleCategoriesQuery } from "@/features/article-category/api/article-category.queries";

export type ArticleStatusFilter = "all" | "draft" | "published";

export function useArticleListPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<ArticleStatusFilter>("all");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sorting, setSorting] = useState<DataTableSortState | undefined>({ columnId: "updatedAt", direction: "desc" });
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const debouncedKeyword = useDebouncedValue(keyword);
  const categories = useAllArticleCategoriesQuery();
  const deleteMutation = useDeleteArticleMutation();

  const filters: CriteriaFilter[] = [];
  if (status !== "all") filters.push(criteriaFilter("status", "eq", status));
  if (categoryId !== "all") filters.push(criteriaFilter("categoryId", "eq", categoryId));

  const query = useArticlesQuery({
    keyword: debouncedKeyword || undefined,
    filters,
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
    status,
    setStatus: (value: ArticleStatusFilter) => {
      setStatus(value);
      setPage(1);
    },
    categoryId,
    setCategoryId: (value: string) => {
      setCategoryId(value);
      setPage(1);
    },
    categories: categories.data ?? [],
    sorting,
    setSorting,
    data: table?.data ?? [],
    pagination: table?.pagination,
    onPaginationChange: (next: { pageNumber: number; pageSize: number }) => {
      setPage(next.pageNumber);
      setPageSize(next.pageSize);
    },
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    goToNew: () => router.push("/content/articles/new"),
    goToEdit: (id: string) => router.push(`/content/articles/${id}`),
    deleteTarget,
    openDeleteConfirm: (id: string, title: string) => setDeleteTarget({ id, title }),
    closeDeleteConfirm: () => setDeleteTarget(null),
    confirmDelete: async () => {
      if (!deleteTarget) return;
      await deleteMutation.mutateAsync(deleteTarget.id);
      setDeleteTarget(null);
    },
    deleteMutation,
  };
}
