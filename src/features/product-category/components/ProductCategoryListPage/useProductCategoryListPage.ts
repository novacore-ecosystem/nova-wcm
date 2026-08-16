"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { criteriaFilter, criteriaSort, type CriteriaRequest } from "@novacore/frontend-foundation";
import { useDebouncedValue, type DataTablePaginationState } from "@novacore/frontend-next-shadcn";

import {
  useDeleteProductCategoryMutation,
  useProductCategoriesQuery,
} from "@/features/product-category/api/product-category.queries";
import type { ProductCategory } from "@/services/product-category";

export type ProductCategoryStatusFilter = "all" | "active" | "inactive";

export function useProductCategoryListPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductCategoryStatusFilter>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<ProductCategory | null>(null);

  const debouncedKeyword = useDebouncedValue(keyword, 300);

  const request = useMemo<CriteriaRequest>(
    () => ({
      keyword: debouncedKeyword || undefined,
      filters: statusFilter === "all" ? [] : [criteriaFilter("status", "eq", statusFilter)],
      sorts: [criteriaSort("updatedAt", "desc")],
      page: pageNumber,
      pageSize,
    }),
    [debouncedKeyword, statusFilter, pageNumber, pageSize],
  );

  const categoriesQuery = useProductCategoriesQuery(request);
  const deleteMutation = useDeleteProductCategoryMutation();

  function onSearchChange(value: string) {
    setKeyword(value);
    setPageNumber(1);
  }

  function onStatusFilterChange(value: ProductCategoryStatusFilter) {
    setStatusFilter(value);
    setPageNumber(1);
  }

  function onPaginationChange(pagination: DataTablePaginationState) {
    setPageNumber(pagination.pageNumber);
    setPageSize(pagination.pageSize);
  }

  function onEdit(category: ProductCategory) {
    router.push(`/catalog/categories/${category.id}`);
  }

  function onAddNew() {
    router.push("/catalog/categories/new");
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }

  return {
    keyword,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    categoriesQuery,
    onPaginationChange,
    onEdit,
    onAddNew,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.isError ? "Could not delete this category. Try again." : null,
  };
}
