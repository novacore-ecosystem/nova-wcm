"use client";

import { Star, Trash2 } from "lucide-react";
import {
  Button,
  ConfirmDialog,
  DataTable,
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
import { useArticleListPage, type ArticleStatusFilter } from "@/features/article/components/ArticleListPage/useArticleListPage";
import type { Article } from "@/services/article";

export function ArticleListPage() {
  const { t } = useAppTranslation();
  const page = useArticleListPage();

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("article.listTitle", "Articles")}
          description={t("article.listDescription", "Write and publish content for your website's blog.")}
          actions={
            <Button size="sm" onClick={page.goToNew}>
              {t("article.newArticle", "Write article")}
            </Button>
          }
        />

        <Toolbar>
          <SearchInput value={page.keyword} onValueChange={page.setKeyword} placeholder={t("article.search", "Search articles…")} className="max-w-xs" />
          <Select
            value={page.status}
            onValueChange={(value) => page.setStatus(value as ArticleStatusFilter)}
            className="w-40"
            options={[
              { value: "all", label: t("article.allStatuses", "All statuses") },
              { value: "draft", label: t("article.draft", "Draft") },
              { value: "published", label: t("article.published", "Published") },
            ]}
          />
          <Select
            value={page.categoryId}
            onValueChange={page.setCategoryId}
            className="w-48"
            options={[{ value: "all", label: t("article.allCategories", "All categories") }, ...page.categories.map((c) => ({ value: c.id, label: c.name }))]}
          />
        </Toolbar>

        <DataTable<Article>
          data={page.data}
          getRowId={(row) => row.id}
          loading={page.isLoading}
          error={page.isError ? t("states.errorTitle", "Something went wrong") : undefined}
          onRetry={() => page.refetch()}
          emptyMessage={t("article.empty", "No articles match your filters yet.")}
          sorting={page.sorting}
          onSortingChange={page.setSorting}
          pagination={page.pagination}
          onPaginationChange={page.onPaginationChange}
          onRowClick={(row) => page.goToEdit(row.id)}
          columns={[
            {
              id: "title",
              header: t("article.titleField", "Title"),
              sortable: true,
              cell: (row) => (
                <div className="flex items-center gap-3">
                  {row.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={row.coverImageUrl} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
                  ) : (
                    <div className="h-10 w-14 shrink-0 rounded bg-muted" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      {row.featured ? <Star className="size-3.5 shrink-0 fill-primary text-primary" /> : null}
                      <span className="truncate font-medium">{row.title}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">/{row.slug}</p>
                  </div>
                </div>
              ),
            },
            {
              id: "status",
              header: t("article.status", "Status"),
              cell: (row) => <StatusBadge label={row.status === "published" ? "Published" : "Draft"} tone={row.status === "published" ? "success" : "neutral"} />,
            },
            { id: "categoryName", header: t("article.category", "Category"), cell: (row) => row.categoryName ?? "—" },
            { id: "author", header: t("article.author", "Author"), sortable: true },
            { id: "views", header: t("article.views", "Views"), sortable: true, cell: (row) => row.views.toLocaleString() },
            {
              id: "updatedAt",
              header: t("article.updated", "Updated"),
              sortable: true,
              cell: (row) => <RelativeTime date={row.updatedAt} />,
            },
            {
              id: "actions",
              header: "",
              className: "w-10 text-right",
              cell: (row) => (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("article.delete", "Delete article")}
                  onClick={(event) => {
                    event.stopPropagation();
                    page.openDeleteConfirm(row.id, row.title);
                  }}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              ),
            },
          ]}
        />

        <HowTo title={t("article.listHowToTitle", "How to keep your blog worth visiting")}>
          {t(
            "article.listHowToBody",
            "Publish a little, often — one useful article every week or two beats a big batch published once a year. Feature your best 2-3 articles so first-time visitors see your strongest content first.",
          )}
        </HowTo>
      </div>

      <ConfirmDialog
        open={!!page.deleteTarget}
        onOpenChange={(open) => !open && page.closeDeleteConfirm()}
        title={t("article.deleteTitle", "Delete article?")}
        description={t("article.deleteDescription", `"${page.deleteTarget?.title}" will be permanently removed from your website.`)}
        confirmLabel={t("article.deleteConfirm", "Delete")}
        loading={page.deleteMutation.isPending}
        onConfirm={page.confirmDelete}
      />
    </PageContainer>
  );
}
