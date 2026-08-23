"use client";

import { ArchiveRestore, Loader2, Trash2 } from "lucide-react";
import { Badge, Button, ConfirmDialog, DataTable, Input, PageContainer, PageHeader, RelativeTime, Select, Toolbar } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useContentListPage, type ContentStatusFilter, type ContentVisibilityFilter } from "@/features/content/components/ContentListPage/useContentListPage";
import { CONTENT_STATUS_TONE } from "@/features/content/lib/contentStatusTone";
import { CONTENT_VISIBILITY_VALUES } from "@/features/content/content.schema";
import type { ContentStatus, ContentSummary } from "@/services/content";

const CONTENT_STATUS_VALUES: ContentStatus[] = ["draft", "inReview", "approved", "scheduled", "published", "unpublished", "archived", "rejected"];

export function ContentListPage() {
  const { t } = useAppTranslation();
  const page = useContentListPage();

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("content.listTitle", "Content")}
          description={t("content.listDescription", "Articles, news, and blog posts backed by the Content Service.")}
          actions={
            <Button size="sm" onClick={page.goToNew}>
              {t("content.newContent", "Create content")}
            </Button>
          }
        />

        <Toolbar>
          <Select
            value={page.contentTypeId}
            onValueChange={page.setContentTypeId}
            className="w-44"
            options={[{ value: "all", label: t("content.allTypes", "All types") }, ...page.contentTypes.map((type) => ({ value: type.id, label: type.name }))]}
          />
          <Select
            value={page.status}
            onValueChange={(value) => page.setStatus(value as ContentStatusFilter)}
            className="w-40"
            options={[{ value: "all", label: t("content.allStatuses", "All statuses") }, ...CONTENT_STATUS_VALUES.map((value) => ({ value, label: value }))]}
          />
          <Select
            value={page.visibility}
            onValueChange={(value) => page.setVisibility(value as ContentVisibilityFilter)}
            className="w-40"
            options={[{ value: "all", label: t("content.allVisibilities", "All visibility") }, ...CONTENT_VISIBILITY_VALUES.map((value) => ({ value, label: value }))]}
          />
          <Input type="date" value={page.createdFrom} onChange={(event) => page.setCreatedFrom(event.target.value)} className="w-40" aria-label={t("content.createdFrom", "Created from")} />
          <Input type="date" value={page.createdTo} onChange={(event) => page.setCreatedTo(event.target.value)} className="w-40" aria-label={t("content.createdTo", "Created to")} />
        </Toolbar>

        <DataTable<ContentSummary>
          data={page.items}
          getRowId={(row) => row.id}
          loading={page.isLoading}
          error={page.isError ? t("states.errorTitle", "Something went wrong") : undefined}
          onRetry={() => page.refetch()}
          emptyMessage={t("content.empty", "No content matches your filters yet.")}
          onRowClick={(row) => page.goToEdit(row.id)}
          columns={[
            {
              id: "title",
              header: t("content.titleField", "Title"),
              cell: (row) => (
                <div className="min-w-0">
                  <span className="truncate font-medium">{row.title ?? t("content.untitled", "Untitled")}</span>
                  <p className="truncate text-xs text-muted-foreground">/{row.slug}</p>
                </div>
              ),
            },
            { id: "contentTypeName", header: t("content.contentType", "Type"), cell: (row) => row.contentTypeName },
            {
              id: "status",
              header: t("content.status", "Status"),
              cell: (row) => (
                <Badge variant={CONTENT_STATUS_TONE[row.status]} className="capitalize">
                  {row.status}
                </Badge>
              ),
            },
            { id: "visibility", header: t("content.visibility", "Visibility"), cell: (row) => <span className="capitalize">{row.visibility}</span> },
            { id: "createdAt", header: t("content.created", "Created"), cell: (row) => <RelativeTime date={row.createdAt} /> },
            { id: "updatedAt", header: t("content.updated", "Updated"), cell: (row) => <RelativeTime date={row.updatedAt} /> },
            {
              id: "actions",
              header: "",
              className: "w-20 text-right",
              cell: (row) =>
                row.isDeleted ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("content.restore", "Restore")}
                    loading={page.restoringId === row.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      page.restoreContent(row.id);
                    }}
                  >
                    <ArchiveRestore className="size-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t("content.delete", "Delete content")}
                    onClick={(event) => {
                      event.stopPropagation();
                      page.openDeleteConfirm(row.id, row.slug);
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                ),
            },
          ]}
        />

        <div className="flex items-center justify-center py-2">
          {page.isFetchingNextPage ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : page.hasNextPage ? (
            <Button variant="outline" size="sm" onClick={page.fetchNextPage}>
              {t("content.loadMore", "Load more")}
            </Button>
          ) : page.items.length > 0 ? (
            <span className="text-xs text-muted-foreground">{t("content.allLoaded", "All caught up")}</span>
          ) : null}
        </div>
      </div>

      <ConfirmDialog
        open={!!page.deleteTarget}
        onOpenChange={(open) => !open && page.closeDeleteConfirm()}
        title={t("content.deleteTitle", "Delete this content?")}
        description={t("content.deleteDescription", `"/${page.deleteTarget?.slug}" will be hidden everywhere but can be restored later.`)}
        confirmLabel={t("content.delete", "Delete")}
        loading={page.deleteMutation.isPending}
        onConfirm={page.confirmDelete}
      />
    </PageContainer>
  );
}
