"use client";

import type { UseFormReturn } from "react-hook-form";
import { FileText } from "lucide-react";
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
  Textarea,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { formatFileSize } from "@/features/media/lib/formatFileSize";
import type { EditMediaMetadataFormValues } from "@/features/media/media.schema";
import type { MediaAsset } from "@/services/media";

export function MediaPreviewDialog({
  asset,
  onOpenChange,
  form,
  onSubmit,
  isSaving,
}: {
  asset: MediaAsset | null;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<EditMediaMetadataFormValues>;
  onSubmit: (values: EditMediaMetadataFormValues) => void | Promise<void>;
  isSaving: boolean;
}) {
  const { t } = useAppTranslation();
  const { register } = form;

  return (
    <Dialog open={!!asset} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="truncate">{asset?.fileName}</DialogTitle>
        </DialogHeader>

        {asset ? (
          <div className="grid gap-4">
            <div className="flex items-center justify-center overflow-hidden rounded-lg border border-border bg-muted">
              {asset.kind === "image" && asset.url ? (
                // eslint-disable-next-line @next/next/no-img-element -- external picsum.photos placeholders, next.config.ts image domains not modifiable here
                <img src={asset.url} alt={asset.altText || asset.fileName} className="max-h-80 w-full object-contain" />
              ) : (
                <div className="flex h-40 w-full items-center justify-center">
                  <FileText className="size-12 text-muted-foreground" />
                </div>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
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

            <Form form={form} onSubmit={onSubmit} className="grid gap-3">
              <FormField
                label={t("media.preview.altText", "Văn bản thay thế (Alt text)")}
                htmlFor="previewAltText"
                description={t("media.preview.altTextHelp", "Giúp công cụ tìm kiếm và người dùng khiếm thị hiểu nội dung ảnh.")}
              >
                <Input id="previewAltText" {...register("altText")} />
              </FormField>

              <div className="grid gap-3 border-t border-border pt-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("media.preview.seoSectionTitle", "SEO / Metadata")}
                </p>
                <FormField
                  label={t("media.preview.title", "Tiêu đề")}
                  htmlFor="previewTitle"
                  description={t("media.preview.titleHelp", "Tên ngắn gọn, dễ đọc cho tệp — khác với Alt text và Mô tả.")}
                >
                  <Input id="previewTitle" {...register("title")} />
                </FormField>
                <FormField
                  label={t("media.preview.description", "Mô tả")}
                  htmlFor="previewDescription"
                  description={t("media.preview.descriptionHelp", "Thông tin bối cảnh chi tiết hơn về nội dung ảnh.")}
                >
                  <Textarea id="previewDescription" rows={2} {...register("description")} />
                </FormField>
                <div className="grid grid-cols-2 gap-3">
                  <FormField label={t("media.preview.author", "Tác giả")} htmlFor="previewAuthor">
                    <Input id="previewAuthor" {...register("author")} />
                  </FormField>
                  <FormField label={t("media.preview.copyright", "Bản quyền")} htmlFor="previewCopyright">
                    <Input id="previewCopyright" {...register("copyright")} />
                  </FormField>
                </div>
                <FormField label={t("media.preview.rating", "Đánh giá (0–5)")} htmlFor="previewRating">
                  <Input id="previewRating" type="number" min={0} max={5} step={1} {...register("rating")} />
                </FormField>
              </div>

              <DialogFooter>
                <Button type="submit" loading={isSaving}>
                  {t("common.save", "Lưu thay đổi")}
                </Button>
              </DialogFooter>
            </Form>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
