"use client";

import type { UseFormReturn } from "react-hook-form";
import { FormField, Input } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { EditMediaMetadataFormValues } from "@/features/media/media.schema";
import type { MediaKind } from "@/services/media";

/** Kind-specific fields for the Metadata tab — the one place that branches on `MediaKind`, per §18's extensibility requirement. Adding a new kind means adding one more case here. */
export function MediaTypeMetadataFields({ kind, form }: { kind: MediaKind; form: UseFormReturn<EditMediaMetadataFormValues> }) {
  const { t } = useAppTranslation();
  const { register } = form;

  if (kind === "video" || kind === "audio") {
    return (
      <FormField label={t("media.preview.duration", "Thời lượng (giây)")} htmlFor="previewDuration">
        <Input id="previewDuration" type="number" min={0} step={1} {...register("durationSeconds")} />
      </FormField>
    );
  }

  if (kind === "document") {
    return (
      <FormField label={t("media.preview.pageCount", "Số trang")} htmlFor="previewPageCount">
        <Input id="previewPageCount" type="number" min={0} step={1} {...register("pageCount")} />
      </FormField>
    );
  }

  return <p className="text-xs text-muted-foreground">{t("media.preview.noTypeMetadata", "Không có thêm trường riêng cho loại tệp này.")}</p>;
}
