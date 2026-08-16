"use client";

import type { UseFormReturn } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import type { UploadMediaFormValues } from "@/features/media/media.schema";

export function UploadMediaDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  isSubmitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<UploadMediaFormValues>;
  onSubmit: (values: UploadMediaFormValues) => void | Promise<void>;
  isSubmitting: boolean;
}) {
  const { t } = useAppTranslation();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("media.upload.title", "Tải ảnh lên")}</DialogTitle>
          <DialogDescription>
            {t("media.upload.description", "Chưa kết nối lưu trữ thật — thao tác này sẽ tạo một tệp mẫu trong thư viện.")}
          </DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit} className="grid gap-4">
          <FormField label={t("media.upload.fileName", "Tên tệp")} htmlFor="fileName" required error={errors.fileName?.message}>
            <Input
              id="fileName"
              placeholder="vi-du-anh-san-pham.jpg"
              invalid={!!errors.fileName}
              {...register("fileName")}
            />
          </FormField>
          <FormField
            label={t("media.upload.altText", "Văn bản thay thế (Alt text)")}
            htmlFor="uploadAltText"
            description={t("media.upload.altTextHelp", "Mô tả ngắn gọn nội dung ảnh — giúp SEO và trợ năng.")}
          >
            <Input id="uploadAltText" placeholder="Bàn ăn gỗ sồi tự nhiên 6 chỗ ngồi" {...register("altText")} />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              {t("common.cancel", "Hủy")}
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {t("media.upload.submit", "Tải lên")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
