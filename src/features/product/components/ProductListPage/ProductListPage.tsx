"use client";

import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  ConfirmDialog,
  DataTable,
  fromPaginatedResult,
  PageContainer,
  PageHeader,
  RelativeTime,
  SearchInput,
  Select,
  StatusBadge,
  Toolbar,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useProductListPage, type ProductStatusFilter } from "./useProductListPage";
import type { Product } from "@/services/product";

const STATUS_TONE: Record<Product["status"], "success" | "neutral"> = {
  published: "success",
  draft: "neutral",
};

export function ProductListPage() {
  const { t } = useAppTranslation();
  const {
    keyword,
    onSearchChange,
    categoryFilter,
    onCategoryFilterChange,
    categoryOptions,
    statusFilter,
    onStatusFilterChange,
    productsQuery,
    onPaginationChange,
    onEdit,
    onAddNew,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting,
    deleteError,
  } = useProductListPage();

  const { data, pagination } = productsQuery.data
    ? fromPaginatedResult(productsQuery.data)
    : { data: [] as Product[], pagination: undefined };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("catalog.products.title", "Products")}
          description={t("catalog.products.description", "Manage what customers see in your catalog.")}
          actions={
            <Button onClick={onAddNew}>
              <Plus className="size-4" />
              {t("catalog.products.add", "Add product")}
            </Button>
          }
        />

        <Toolbar>
          <SearchInput
            value={keyword}
            onValueChange={onSearchChange}
            placeholder={t("catalog.products.searchPlaceholder", "Search products…")}
            className="w-full max-w-xs"
          />
          <Select
            value={categoryFilter}
            onValueChange={onCategoryFilterChange}
            options={[
              { value: "all", label: t("catalog.products.filterAllCategories", "All categories") },
              ...categoryOptions.map((category) => ({ value: category.id, label: category.name })),
            ]}
            className="w-56"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusFilterChange(value as ProductStatusFilter)}
            options={[
              { value: "all", label: t("catalog.products.filterAllStatuses", "All statuses") },
              { value: "published", label: t("catalog.products.published", "Published") },
              { value: "draft", label: t("catalog.products.draft", "Draft") },
            ]}
            className="w-40"
          />
        </Toolbar>

        <DataTable<Product>
          data={data}
          getRowId={(row) => row.id}
          loading={productsQuery.isLoading}
          error={productsQuery.isError ? t("catalog.products.loadError", "Could not load products.") : undefined}
          onRetry={() => productsQuery.refetch()}
          emptyMessage={t("catalog.products.empty", "No products yet. Add your first product to start building your catalog.")}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          onRowClick={onEdit}
          columns={[
            {
              id: "cover",
              header: "",
              className: "w-16",
              cell: (row) =>
                row.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- mock cover images are arbitrary external placeholder URLs, not part of Next's optimized image pipeline yet
                  <img src={row.coverImageUrl} alt={row.name} className="size-10 rounded-md border border-border object-cover" />
                ) : (
                  <div className="size-10 rounded-md border border-dashed border-border bg-muted" />
                ),
            },
            {
              id: "name",
              header: t("catalog.products.colName", "Name"),
              cell: (row) => (
                <div className="flex flex-col">
                  <span className="font-medium">{row.name}</span>
                  <span className="text-xs text-muted-foreground">/{row.slug}</span>
                </div>
              ),
            },
            {
              id: "category",
              header: t("catalog.products.colCategory", "Category"),
              cell: (row) => row.categoryName,
            },
            {
              id: "featured",
              header: t("catalog.products.colFeatured", "Featured"),
              cell: (row) =>
                row.featured ? (
                  <Badge variant="warning" className="gap-1">
                    <Star className="size-3" />
                    {t("catalog.products.featured", "Featured")}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                ),
            },
            {
              id: "status",
              header: t("catalog.products.colStatus", "Status"),
              cell: (row) => (
                <StatusBadge
                  label={row.status === "published" ? t("catalog.products.published", "Published") : t("catalog.products.draft", "Draft")}
                  tone={STATUS_TONE[row.status]}
                />
              ),
            },
            {
              id: "updatedAt",
              header: t("catalog.products.colUpdated", "Updated"),
              cell: (row) => <RelativeTime date={row.updatedAt} />,
            },
            {
              id: "actions",
              header: "",
              className: "text-right",
              cell: (row) => (
                <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(row)} aria-label={t("catalog.products.edit", "Edit")}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(row)}
                    aria-label={t("catalog.products.delete", "Delete")}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("catalog.products.deleteTitle", "Delete product")}
        description={
          deleteTarget
            ? t("catalog.products.deleteDescription", `Delete "${deleteTarget.name}"? This action cannot be undone.`)
            : undefined
        }
        confirmLabel={t("catalog.products.deleteConfirm", "Delete")}
        loading={isDeleting}
        error={deleteError}
        onConfirm={confirmDelete}
      />
    </PageContainer>
  );
}
