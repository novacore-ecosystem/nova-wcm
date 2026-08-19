"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  RelativeTime,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { formatFileSize } from "@/features/media/lib/formatFileSize";
import { MediaPreview } from "@/features/media/components/MediaLibraryPage/MediaPreview";
import { MediaTypeMetadataFields } from "@/features/media/components/MediaLibraryPage/MediaTypeMetadataFields";
import { StarRating } from "@/features/media/components/MediaLibraryPage/StarRating";
import type { EditMediaMetadataFormValues, EditMediaSeoFormValues } from "@/features/media/media.schema";
import type { MediaAsset } from "@/services/media";

/**
 * Permanent two-column workspace: preview is always visible on the left (never a tab — media
 * types other than images need to actually see/hear what they're editing while they work), tabs
 * (General/Meta/SEO) on the right. The shell caps at 80vh; only the active tab's content scrolls,
 * so the modal itself never grows past the viewport.
 */
export function MediaPreviewDialog({
  asset,
  onOpenChange,
  seoForm,
  onSubmitSeo,
  metadataForm,
  onSubmitMetadata,
  isSaving,
}: {
  asset: MediaAsset | null;
  onOpenChange: (open: boolean) => void;
  seoForm: UseFormReturn<EditMediaSeoFormValues>;
  onSubmitSeo: (values: EditMediaSeoFormValues) => void | Promise<void>;
  metadataForm: UseFormReturn<EditMediaMetadataFormValues>;
  onSubmitMetadata: (values: EditMediaMetadataFormValues) => void | Promise<void>;
  isSaving: boolean;
}) {
  const { t } = useAppTranslation();

  return (
    <Dialog open={!!asset} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] w-full max-w-4xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 border-b border-border p-4">
          <DialogTitle className="truncate">{asset?.fileName}</DialogTitle>
        </DialogHeader>

        {asset ? (
          <div className="grid flex-1 grid-cols-1 overflow-hidden sm:grid-cols-2">
            <div className="flex items-center justify-center overflow-y-auto border-b border-border bg-muted/50 p-6 sm:border-b-0 sm:border-r">
              <MediaPreview asset={asset} />
            </div>

            <div className="flex min-h-0 flex-col overflow-hidden">
              <Tabs defaultValue="general" className="flex min-h-0 flex-1 flex-col">
                <TabsList className="mx-4 mt-4 shrink-0">
                  <TabsTrigger value="general">{t("media.preview.tabGeneral", "Chung")}</TabsTrigger>
                  <TabsTrigger value="metadata">{t("media.preview.tabMetadata", "Metadata")}</TabsTrigger>
                  <TabsTrigger value="seo">{t("media.preview.tabSeo", "SEO")}</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-0 flex-1 overflow-y-auto p-4">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <dt className="text-muted-foreground">{t("media.preview.fileName", "Tên tệp")}</dt>
                    <dd className="truncate">{asset.fileName}</dd>
                    <dt className="text-muted-foreground">{t("media.preview.type", "Loại")}</dt>
                    <dd className="capitalize">{asset.kind}</dd>
                    <dt className="text-muted-foreground">{t("media.preview.mimeType", "MIME")}</dt>
                    <dd>{asset.mimeType}</dd>
                    {asset.width && asset.height ? (
                      <>
                        <dt className="text-muted-foreground">{t("media.preview.dimensions", "Kích thước")}</dt>
                        <dd>
                          {asset.width} × {asset.height}px
                        </dd>
                      </>
                    ) : null}
                    <dt className="text-muted-foreground">{t("media.preview.fileSize", "Dung lượng")}</dt>
                    <dd>{formatFileSize(asset.sizeBytes)}</dd>
                    <dt className="text-muted-foreground">{t("media.preview.uploadedAt", "Ngày tải lên")}</dt>
                    <dd>
                      <RelativeTime date={asset.uploadedAt} />
                    </dd>
                    <dt className="text-muted-foreground">{t("media.preview.uploadedBy", "Người tải lên")}</dt>
                    <dd>{asset.uploadedBy ?? "—"}</dd>
                    <dt className="text-muted-foreground">{t("media.preview.updatedAt", "Cập nhật lần cuối")}</dt>
                    <dd>{asset.updatedAt ? <RelativeTime date={asset.updatedAt} /> : "—"}</dd>
                  </dl>
                </TabsContent>

                <TabsContent value="metadata" className="mt-0 flex-1 overflow-y-auto p-4">
                  <Form form={metadataForm} onSubmit={onSubmitMetadata} className="grid gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label={t("media.preview.author", "Tác giả")} htmlFor="previewAuthor">
                        <Input id="previewAuthor" {...metadataForm.register("author")} />
                      </FormField>
                      <FormField label={t("media.preview.copyright", "Bản quyền")} htmlFor="previewCopyright">
                        <Input id="previewCopyright" {...metadataForm.register("copyright")} />
                      </FormField>
                    </div>
                    <FormField label={t("media.preview.rating", "Đánh giá")}>
                      <StarRating value={metadataForm.watch("rating")} onChange={(value) => metadataForm.setValue("rating", value, { shouldDirty: true })} />
                    </FormField>
                    <div className="border-t border-border pt-3">
                      <MediaTypeMetadataFields kind={asset.kind} form={metadataForm} />
                    </div>
                    <DialogFooter>
                      <Button type="submit" loading={isSaving}>
                        {t("common.save", "Lưu thay đổi")}
                      </Button>
                    </DialogFooter>
                  </Form>
                </TabsContent>

                <TabsContent value="seo" className="mt-0 flex-1 overflow-y-auto p-4">
                  <Form form={seoForm} onSubmit={onSubmitSeo} className="grid gap-3">
                    <FormField
                      label={t("media.preview.altText", "Văn bản thay thế (Alt text)")}
                      htmlFor="previewAltText"
                      description={t("media.preview.altTextHelp", "Giúp công cụ tìm kiếm và người dùng khiếm thị hiểu nội dung ảnh.")}
                    >
                      <Input id="previewAltText" {...seoForm.register("altText")} />
                    </FormField>
                    <FormField
                      label={t("media.preview.title", "Tiêu đề")}
                      htmlFor="previewTitle"
                      description={t("media.preview.titleHelp", "Tên ngắn gọn, dễ đọc cho tệp — khác với Alt text và Mô tả.")}
                    >
                      <Input id="previewTitle" {...seoForm.register("title")} />
                    </FormField>
                    <FormField
                      label={t("media.preview.description", "Mô tả")}
                      htmlFor="previewDescription"
                      description={t("media.preview.descriptionHelp", "Thông tin bối cảnh chi tiết hơn về nội dung ảnh.")}
                    >
                      <Textarea id="previewDescription" rows={2} {...seoForm.register("description")} />
                    </FormField>
                    <DialogFooter>
                      <Button type="submit" loading={isSaving}>
                        {t("common.save", "Lưu thay đổi")}
                      </Button>
                    </DialogFooter>
                  </Form>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
