"use client";

import { useState } from "react";
import { Copy, Download, Eye, EllipsisVertical, FileText, Music, Trash2, Video } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { formatFileSize } from "@/features/media/lib/formatFileSize";
import type { MediaAsset } from "@/services/media";

export function MediaAssetCard({
  asset,
  onPreview,
  onDownload,
  onDelete,
}: {
  asset: MediaAsset;
  onPreview: (asset: MediaAsset) => void;
  onDownload: (asset: MediaAsset) => void;
  onDelete: (asset: MediaAsset) => void;
}) {
  const { t } = useAppTranslation();
  const [copied, setCopied] = useState(false);

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(asset.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — silently ignore, no toast system exists
    }
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40">
      <button
        type="button"
        onClick={() => onPreview(asset)}
        className="flex aspect-[3/2] w-full items-center justify-center bg-muted"
      >
        {asset.kind === "image" && asset.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- next.config.ts is not modifiable in this task; remote picsum.photos placeholders need no domain allowlisting via a plain <img>.
          <img
            src={asset.thumbnailUrl}
            alt={asset.altText || asset.fileName}
            className="h-full w-full object-cover"
          />
        ) : asset.kind === "video" ? (
          <Video className="size-10 text-muted-foreground" />
        ) : asset.kind === "audio" ? (
          <Music className="size-10 text-muted-foreground" />
        ) : (
          <FileText className="size-10 text-muted-foreground" />
        )}
      </button>

      <div className="flex items-start gap-2 p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium" title={asset.fileName}>
            {asset.fileName}
          </p>
          <p className="text-xs text-muted-foreground">{formatFileSize(asset.sizeBytes)}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7 shrink-0" aria-label={t("media.card.actions", "Thao tác")}>
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => onPreview(asset)}>
              <Eye className="mr-2 size-4" />
              {t("media.card.preview", "Xem trước")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(event) => { event.preventDefault(); void handleCopyUrl(); }}>
              <Copy className="mr-2 size-4" />
              {copied ? t("media.card.copied", "Đã sao chép") : t("media.card.copyUrl", "Sao chép URL")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDownload(asset)}>
              <Download className="mr-2 size-4" />
              {t("media.card.download", "Tải xuống")}
            </DropdownMenuItem>
            <DropdownMenuItem destructive onSelect={() => onDelete(asset)}>
              <Trash2 className="mr-2 size-4" />
              {t("media.card.delete", "Xóa")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
