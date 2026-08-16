"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { criteriaFilter, criteriaSort, type CriteriaRequest } from "@novacore/frontend-foundation";
import { useDebouncedValue, type DataTablePaginationState } from "@novacore/frontend-next-shadcn";

import { useAllProductCategoriesQuery } from "@/features/product-category";
import { useDeleteProductMutation, useProductsQuery } from "@/features/product/api/product.queries";
import type { Product } from "@/services/product";

export type ProductStatusFilter = "all" | "draft" | "published";

export function useProductListPage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const debouncedKeyword = useDebouncedValue(keyword, 300);
  const categoriesQuery = useAllProductCategoriesQuery();

  const request = useMemo<CriteriaRequest>(() => {
    const filters = [];
    if (categoryFilter !== "all") filters.push(criteriaFilter("categoryId", "eq", categoryFilter));
    if (statusFilter !== "all") filters.push(criteriaFilter("status", "eq", statusFilter));

    return {
      keyword: debouncedKeyword || undefined,
      filters,
      sorts: [criteriaSort("updatedAt", "desc")],
      page: pageNumber,
      pageSize,
    };
  }, [debouncedKeyword, categoryFilter, statusFilter, pageNumber, pageSize]);

  const productsQuery = useProductsQuery(request);
  const deleteMutation = useDeleteProductMutation();

  function onSearchChange(value: string) {
    setKeyword(value);
    setPageNumber(1);
  }

  function onCategoryFilterChange(value: string) {
    setCategoryFilter(value);
    setPageNumber(1);
  }

  function onStatusFilterChange(value: ProductStatusFilter) {
    setStatusFilter(value);
    setPageNumber(1);
  }

  function onPaginationChange(pagination: DataTablePaginationState) {
    setPageNumber(pagination.pageNumber);
    setPageSize(pagination.pageSize);
  }

  function onEdit(product: Product) {
    router.push(`/catalog/products/${product.id}`);
  }

  function onAddNew() {
    router.push("/catalog/products/new");
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
  }

  return {
    keyword,
    onSearchChange,
    categoryFilter,
    onCategoryFilterChange,
    categoryOptions: categoriesQuery.data ?? [],
    statusFilter,
    onStatusFilterChange,
    productsQuery,
    onPaginationChange,
    onEdit,
    onAddNew,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.isError ? "Could not delete this product. Try again." : null,
  };
}
