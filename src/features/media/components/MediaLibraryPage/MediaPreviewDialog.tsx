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
import type { EditMediaMetadataFormValues, EditMediaSeoFormValues } from "@/features/media/media.schema";
import type { MediaAsset } from "@/services/media";

/**
 * Redesigned as a tabbed dialog (General / Preview / SEO / Metadata) instead of one long scrolling
 * form — each tab maps to its own PATCH (see `useMediaLibraryPage`'s `submitSeo`/`submitMetadata`),
 * and Metadata switches fields by `asset.kind` rather than assuming every asset is an image.
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="truncate">{asset?.fileName}</DialogTitle>
        </DialogHeader>

        {asset ? (
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTrigger value="general">{t("media.preview.tabGeneral", "Chung")}</TabsTrigger>
              <TabsTrigger value="preview">{t("media.preview.tabPreview", "Xem trước")}</TabsTrigger>
              <TabsTrigger value="seo">{t("media.preview.tabSeo", "SEO")}</TabsTrigger>
              <TabsTrigger value="metadata">{t("media.preview.tabMetadata", "Metadata")}</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
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
              </dl>
            </TabsContent>

            <TabsContent value="preview">
              <MediaPreview asset={asset} />
            </TabsContent>

            <TabsContent value="seo">
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

            <TabsContent value="metadata">
              <Form form={metadataForm} onSubmit={onSubmitMetadata} className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField label={t("media.preview.author", "Tác giả")} htmlFor="previewAuthor">
                    <Input id="previewAuthor" {...metadataForm.register("author")} />
                  </FormField>
                  <FormField label={t("media.preview.copyright", "Bản quyền")} htmlFor="previewCopyright">
                    <Input id="previewCopyright" {...metadataForm.register("copyright")} />
                  </FormField>
                </div>
                <FormField label={t("media.preview.rating", "Đánh giá (0–5)")} htmlFor="previewRating">
                  <Input id="previewRating" type="number" min={0} max={5} step={1} {...metadataForm.register("rating")} />
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
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
