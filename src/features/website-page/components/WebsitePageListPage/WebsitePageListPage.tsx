"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Info, Pencil, Plus, Trash2 } from "lucide-react";
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
  type DataTableColumn,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useWebsitePageListPage } from "@/features/website-page/components/WebsitePageListPage/useWebsitePageListPage";
import type { WebsitePage } from "@/services/website-page";

export function WebsitePageListPage() {
  const { t } = useAppTranslation();
  const router = useRouter();
  const {
    search,
    setSearch,
    pagination,
    setPagination,
    pagesQuery,
    togglePublish,
    isTogglingStatus,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting,
  } = useWebsitePageListPage();

  const columns: DataTableColumn<WebsitePage>[] = [
    {
      id: "title",
      header: t("websitePage.list.columnTitle", "Tiêu đề"),
      cell: (row) => <span className="font-medium">{row.title}</span>,
    },
    {
      id: "slug",
      header: t("websitePage.list.columnSlug", "Đường dẫn"),
      cell: (row) => <span className="text-muted-foreground">/{row.slug}</span>,
    },
    {
      id: "status",
      header: t("websitePage.list.columnStatus", "Trạng thái"),
      cell: (row) =>
        row.status === "published" ? (
          <StatusBadge tone="success" label={t("websitePage.status.published", "Đã xuất bản")} />
        ) : (
          <StatusBadge tone="neutral" label={t("websitePage.status.draft", "Bản nháp")} />
        ),
    },
    {
      id: "updatedAt",
      header: t("websitePage.list.columnUpdated", "Cập nhật"),
      cell: (row) => <RelativeTime date={row.updatedAt} />,
    },
    {
      id: "actions",
      header: "",
      className: "text-right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(event) => event.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            title={row.status === "published" ? t("websitePage.list.unpublish", "Gỡ xuất bản") : t("websitePage.list.publish", "Xuất bản")}
            disabled={isTogglingStatus}
            onClick={() => togglePublish(row)}
          >
            {row.status === "published" ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="size-8" asChild>
            <Link href={`/website/pages/${row.id}`} title={t("common.edit", "Chỉnh sửa")}>
              <Pencil className="size-4" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={() => setDeleteTarget(row)}>
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("websitePage.title", "Trang website")}
          description={t("websitePage.description", "Quản lý nội dung các trang trên website của bạn.")}
          actions={
            <Button asChild>
              <Link href="/website/pages/new">
                <Plus className="mr-2 size-4" />
                {t("websitePage.addButton", "Thêm trang")}
              </Link>
            </Button>
          }
        />

        <HowTo title={t("websitePage.howTo.title", "Cách viết trang website hiệu quả")} icon={<Info className="size-4" />}>
          {t(
            "websitePage.howTo.body",
            "Giữ nội dung ngắn gọn, dễ đọc lướt — một trang landing page không cần dài như một cuốn tiểu thuyết. Tập trung vào điều khách hàng cần biết nhất.",
          )}
        </HowTo>

        <Toolbar>
          <SearchInput
            value={search}
            onValueChange={setSearch}
            placeholder={t("websitePage.searchPlaceholder", "Tìm theo tiêu đề hoặc đường dẫn…")}
            className="w-full max-w-sm"
          />
        </Toolbar>

        <DataTable
          data={pagesQuery.data?.items ?? []}
          columns={columns}
          getRowId={(row) => row.id}
          loading={pagesQuery.isLoading}
          error={pagesQuery.isError ? t("states.errorTitle", "Đã có lỗi xảy ra") : undefined}
          onRetry={() => pagesQuery.refetch()}
          emptyMessage={t("websitePage.empty", "Chưa có trang nào. Thêm trang đầu tiên cho website của bạn.")}
          pagination={pagination}
          onPaginationChange={setPagination}
          onRowClick={(row) => router.push(`/website/pages/${row.id}`)}
        />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("websitePage.delete.title", "Xóa trang này?")}
        description={t("websitePage.delete.description", "Trang sẽ bị xóa khỏi website và không thể khôi phục.")}
        confirmLabel={t("common.delete", "Xóa")}
        cancelLabel={t("common.cancel", "Hủy")}
        loading={isDeleting}
        onConfirm={confirmDelete}
      />
    </PageContainer>
  );
}
