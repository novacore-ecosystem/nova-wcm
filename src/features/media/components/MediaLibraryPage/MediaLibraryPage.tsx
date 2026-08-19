"use client";

import { ImageIcon, Info, Upload } from "lucide-react";
import {
  Button,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  HowTo,
  Pagination,
  PageContainer,
  PageHeader,
  SearchInput,
  Select,
  SkeletonList,
  Toolbar,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { useMediaLibraryPage, type MediaTypeFilter } from "@/features/media/components/MediaLibraryPage/useMediaLibraryPage";
import { MediaAssetCard } from "@/features/media/components/MediaLibraryPage/MediaAssetCard";
import { UploadMediaDialog } from "@/features/media/components/MediaLibraryPage/UploadMediaDialog";
import { MediaPreviewDialog } from "@/features/media/components/MediaLibraryPage/MediaPreviewDialog";

export function MediaLibraryPage() {
  const { t } = useAppTranslation();
  const {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    pagination,
    setPagination,
    assetsQuery,
    uploadOpen,
    setUploadOpen,
    openUploadDialog,
    uploadForm,
    submitUpload,
    isUploading,
    previewAsset,
    setPreviewAsset,
    openPreview,
    metadataForm,
    submitMetadata,
    isSavingMetadata,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting,
  } = useMediaLibraryPage();

  const typeOptions: { value: MediaTypeFilter; label: string }[] = [
    { value: "all", label: t("media.filter.all", "Tất cả") },
    { value: "image", label: t("media.filter.image", "Hình ảnh") },
    { value: "document", label: t("media.filter.document", "Tài liệu") },
  ];

  const assets = assetsQuery.data?.items ?? [];

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={t("media.title", "Thư viện ảnh")}
          description={t("media.description", "Quản lý ảnh và tài liệu dùng cho website của bạn.")}
          actions={
            <Button onClick={openUploadDialog}>
              <Upload className="mr-2 size-4" />
              {t("media.uploadButton", "Tải lên")}
            </Button>
          }
        />

        <HowTo title={t("media.howTo.title", "Cách chọn ảnh cho website")} icon={<Info className="size-4" />}>
          {t(
            "media.howTo.body",
            "Dùng ảnh sáng, rõ nét, chụp thật; tránh ảnh quá nặng làm chậm trang; luôn thêm văn bản thay thế (alt text) để hỗ trợ SEO và người dùng khiếm thị.",
          )}
        </HowTo>

        <Toolbar>
          <SearchInput
            value={search}
            onValueChange={setSearch}
            placeholder={t("media.searchPlaceholder", "Tìm theo tên tệp hoặc alt text…")}
            className="w-full max-w-sm"
          />
          <Select
            className="w-40"
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as MediaTypeFilter)}
            options={typeOptions}
          />
        </Toolbar>

        {assetsQuery.isLoading ? (
          <SkeletonList rows={4} />
        ) : assetsQuery.isError ? (
          <ErrorState onRetry={() => assetsQuery.refetch()} />
        ) : assets.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="h-8 w-8" />}
            title={t("media.empty.title", "Chưa có tệp nào")}
            description={t("media.empty.description", "Tải lên ảnh hoặc tài liệu đầu tiên cho thư viện của bạn.")}
            action={
              <Button variant="outline" onClick={openUploadDialog}>
                {t("media.uploadButton", "Tải lên")}
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {assets.map((asset) => (
                <MediaAssetCard key={asset.id} asset={asset} onPreview={openPreview} onDelete={setDeleteTarget} />
              ))}
            </div>
            <Pagination
              pageNumber={pagination.pageNumber}
              pageSize={pagination.pageSize}
              totalRows={pagination.totalRows}
              onPaginationChange={setPagination}
              pageSizeOptions={[12, 24, 48]}
            />
          </>
        )}
      </div>

      <UploadMediaDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        form={uploadForm}
        onSubmit={submitUpload}
        isSubmitting={isUploading}
      />

      <MediaPreviewDialog
        asset={previewAsset}
        onOpenChange={(open) => !open && setPreviewAsset(null)}
        form={metadataForm}
        onSubmit={submitMetadata}
        isSaving={isSavingMetadata}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("media.delete.title", "Xóa tệp này?")}
        description={t("media.delete.description", "Tệp sẽ bị xóa khỏi thư viện và không thể khôi phục.")}
        confirmLabel={t("common.delete", "Xóa")}
        cancelLabel={t("common.cancel", "Hủy")}
        loading={isDeleting}
        onConfirm={confirmDelete}
      />
    </PageContainer>
  );
}
