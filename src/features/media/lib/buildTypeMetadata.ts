import type { MediaKind, MediaTypeMetadata } from "@/services/media";

/** Maps the Metadata tab's flat form fields back onto the per-kind `MediaTypeMetadata` union — the one place that knows which fields apply to which `MediaKind`. */
export function buildTypeMetadata(kind: MediaKind, values: { durationSeconds?: number; pageCount?: number }): MediaTypeMetadata | undefined {
  switch (kind) {
    case "video":
      return { kind: "video", durationSeconds: values.durationSeconds };
    case "audio":
      return { kind: "audio", durationSeconds: values.durationSeconds };
    case "document":
      return { kind: "document", pageCount: values.pageCount };
    case "image":
      return { kind: "image" };
    default:
      return undefined;
  }
}
