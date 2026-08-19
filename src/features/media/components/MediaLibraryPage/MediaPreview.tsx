"use client";

import { FileText, Music } from "lucide-react";

import type { MediaAsset } from "@/services/media";

/** Renders the actual media by kind — the Preview tab's one job, kept separate from metadata editing so a future `MediaKind` only needs a new branch here. */
export function MediaPreview({ asset }: { asset: MediaAsset }) {
  if (asset.kind === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external picsum.photos placeholders, next.config.ts image domains not modifiable here
      <img src={asset.url} alt={asset.altText || asset.fileName} className="max-h-80 w-full rounded-lg border border-border bg-muted object-contain" />
    );
  }

  if (asset.kind === "video") {
    return (
      <div className="flex h-56 w-full flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted text-muted-foreground">
        <p className="text-sm">Video preview unavailable — no real file storage is connected yet.</p>
        <p className="text-xs">{asset.url}</p>
      </div>
    );
  }

  if (asset.kind === "audio") {
    return (
      <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted text-muted-foreground">
        <Music className="size-8" />
        <p className="text-xs">{asset.fileName}</p>
      </div>
    );
  }

  return (
    <div className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-lg border border-border bg-muted text-muted-foreground">
      <FileText className="size-10" />
      <p className="text-xs">{asset.fileName}</p>
    </div>
  );
}
