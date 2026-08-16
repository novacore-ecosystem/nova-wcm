"use client";

import { Trash2 } from "lucide-react";
import {
  Button,
  ConfirmDialog,
  DataTable,
  HowTo,
  PageContainer,
  PageHeader,
  RelativeTime,
  SearchInput,
  StatusBadge,
  Toolbar,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useArticleCategoryListPage } from "@/features/article-category/components/ArticleCategoryListPage/useArticleCategoryListPage";
import type { ArticleCategory } from "@/services/article-category";

export function ArticleCategoryListPage() {
  const { t } = useAppTranslation();
  const page = useArticleCategoryListPage();

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("articleCategory.title", "Categories")}
          description={t("articleCategory.description", "Group your articles so readers can browse by topic.")}
          actions={
            <Button size="sm" onClick={page.goToNew}>
              {t("articleCategory.new", "New category")}
            </Button>
          }
        />

        <Toolbar>
          <SearchInput value={page.keyword} onValueChange={page.setKeyword} placeholder={t("articleCategory.search", "Search categories…")} className="max-w-xs" />
        </Toolbar>

        <DataTable<ArticleCategory>
          data={page.data}
          getRowId={(row) => row.id}
          loading={page.isLoading}
          error={page.isError ? t("states.errorTitle", "Something went wrong") : undefined}
          onRetry={() => page.refetch()}
          emptyMessage={t("articleCategory.empty", "No categories yet. Create your first one to start organizing articles.")}
          sorting={page.sorting}
          onSortingChange={page.setSorting}
          pagination={page.pagination}
          onPaginationChange={page.onPaginationChange}
          onRowClick={(row) => page.goToEdit(row.id)}
          columns={[
            { id: "name", header: t("articleCategory.name", "Name"), sortable: true, cell: (row) => <span className="font-medium">{row.name}</span> },
            { id: "slug", header: t("articleCategory.slug", "Slug"), cell: (row) => <span className="text-muted-foreground">/{row.slug}</span> },
            { id: "articleCount", header: t("articleCategory.articleCount", "Articles"), sortable: true },
            {
              id: "status",
              header: t("articleCategory.status", "Status"),
              cell: (row) => <StatusBadge label={row.status === "active" ? "Active" : "Inactive"} tone={row.status === "active" ? "success" : "neutral"} />,
            },
            { id: "updatedAt", header: t("articleCategory.updated", "Updated"), sortable: true, cell: (row) => <RelativeTime date={row.updatedAt} /> },
            {
              id: "actions",
              header: "",
              className: "w-10 text-right",
              cell: (row) => (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("articleCategory.delete", "Delete category")}
                  onClick={(event) => {
                    event.stopPropagation();
                    page.openDeleteConfirm(row.id, row.name);
                  }}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              ),
            },
          ]}
        />

        <HowTo title={t("articleCategory.howToTitle", "How to organize categories")}>
          {t(
            "articleCategory.howToBody",
            "Keep it to a handful of clear topics readers actually search for. Too many categories make your blog feel cluttered — 4 to 6 is plenty for most small business sites.",
          )}
        </HowTo>
      </div>

      <ConfirmDialog
        open={!!page.deleteTarget}
        onOpenChange={(open) => !open && page.closeDeleteConfirm()}
        title={t("articleCategory.deleteTitle", "Delete category?")}
        description={t("articleCategory.deleteDescription", `"${page.deleteTarget?.name}" will be removed. Articles in it will keep their content but lose this category.`)}
        confirmLabel={t("articleCategory.deleteConfirm", "Delete")}
        loading={page.deleteMutation.isPending}
        error={page.deleteMutation.isError ? t("states.errorTitle", "Something went wrong") : null}
        onConfirm={page.confirmDelete}
      />
    </PageContainer>
  );
}
