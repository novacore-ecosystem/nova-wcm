"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  Button,
  ConfirmDialog,
  DataTable,
  fromPaginatedResult,
  HowTo,
  PageContainer,
  PageHeader,
  RelativeTime,
  SearchInput,
  Select,
  StatusBadge,
  Toolbar,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useProductCategoryListPage, type ProductCategoryStatusFilter } from "./useProductCategoryListPage";
import type { ProductCategory } from "@/services/product-category";

const STATUS_TONE: Record<ProductCategory["status"], "success" | "neutral"> = {
  active: "success",
  inactive: "neutral",
};

export function ProductCategoryListPage() {
  const { t } = useAppTranslation();
  const {
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
    isDeleting,
    deleteError,
  } = useProductCategoryListPage();

  const { data, pagination } = categoriesQuery.data
    ? fromPaginatedResult(categoriesQuery.data)
    : { data: [] as ProductCategory[], pagination: undefined };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("catalog.categories.title", "Categories")}
          description={t("catalog.categories.description", "Group your products so customers can browse them easily.")}
          actions={
            <Button onClick={onAddNew}>
              <Plus className="size-4" />
              {t("catalog.categories.add", "Add category")}
            </Button>
          }
        />

        <HowTo title={t("catalog.categories.howToTitle", "How to organize categories")}>
          {t(
            "catalog.categories.howToBody",
            "Keep it simple: 3–5 categories is usually enough for a small business site. Avoid nesting categories inside each other — a flat list is easier for customers to browse.",
          )}
        </HowTo>

        <Toolbar>
          <SearchInput
            value={keyword}
            onValueChange={onSearchChange}
            placeholder={t("catalog.categories.searchPlaceholder", "Search categories…")}
            className="w-full max-w-xs"
          />
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusFilterChange(value as ProductCategoryStatusFilter)}
            options={[
              { value: "all", label: t("catalog.categories.filterAll", "All statuses") },
              { value: "active", label: t("catalog.categories.filterActive", "Active") },
              { value: "inactive", label: t("catalog.categories.filterInactive", "Inactive") },
            ]}
            className="w-40"
          />
        </Toolbar>

        <DataTable<ProductCategory>
          data={data}
          getRowId={(row) => row.id}
          loading={categoriesQuery.isLoading}
          error={categoriesQuery.isError ? t("catalog.categories.loadError", "Could not load categories.") : undefined}
          onRetry={() => categoriesQuery.refetch()}
          emptyMessage={t("catalog.categories.empty", "No categories yet. Add your first one to start organizing products.")}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          onRowClick={onEdit}
          columns={[
            {
              id: "name",
              header: t("catalog.categories.colName", "Name"),
              cell: (row) => (
                <div className="flex flex-col">
                  <span className="font-medium">{row.name}</span>
                  <span className="text-xs text-muted-foreground">/{row.slug}</span>
                </div>
              ),
            },
            {
              id: "productCount",
              header: t("catalog.categories.colProducts", "Products"),
              cell: (row) => row.productCount,
            },
            {
              id: "status",
              header: t("catalog.categories.colStatus", "Status"),
              cell: (row) => (
                <StatusBadge
                  label={
                    row.status === "active"
                      ? t("catalog.categories.active", "Active")
                      : t("catalog.categories.inactive", "Inactive")
                  }
                  tone={STATUS_TONE[row.status]}
                />
              ),
            },
            {
              id: "updatedAt",
              header: t("catalog.categories.colUpdated", "Updated"),
              cell: (row) => <RelativeTime date={row.updatedAt} />,
            },
            {
              id: "actions",
              header: "",
              className: "text-right",
              cell: (row) => (
                <div className="flex justify-end gap-1" onClick={(event) => event.stopPropagation()}>
                  <Button variant="ghost" size="icon" onClick={() => onEdit(row)} aria-label={t("catalog.categories.edit", "Edit")}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteTarget(row)}
                    aria-label={t("catalog.categories.delete", "Delete")}
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
        title={t("catalog.categories.deleteTitle", "Delete category")}
        description={
          deleteTarget
            ? t(
                "catalog.categories.deleteDescription",
                `Delete "${deleteTarget.name}"? Products in this category keep their data but lose this category.`,
              )
            : undefined
        }
        confirmLabel={t("catalog.categories.deleteConfirm", "Delete")}
        loading={isDeleting}
        error={deleteError}
        onConfirm={confirmDelete}
      />
    </PageContainer>
  );
}
