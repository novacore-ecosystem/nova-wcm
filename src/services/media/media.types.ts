export type MediaKind = "image" | "video" | "audio" | "document";

/**
 * Per-kind extension point (§18 of the WCM AI-readiness task): each `MediaKind` gets its own
 * metadata shape instead of the Media UI hardcoding fields around images. Adding a new kind means
 * adding one more union member here, not reworking `MediaPreviewDialog`.
 */
export type MediaTypeMetadata =
  | { kind: "image" }
  | { kind: "video"; durationSeconds?: number }
  | { kind: "audio"; durationSeconds?: number }
  | { kind: "document"; pageCount?: number };

export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  /** Today just a single pre-baked preview URL, not a real variant system. A future `variants` object (thumbnail/small/medium/large) is the intended extension point once the backend generates optimized sizes — not modeled yet since nothing produces or reads it. */
  thumbnailUrl?: string;
  mimeType: string;
  sizeBytes: number;
  kind: MediaKind;
  width?: number;
  height?: number;
  altText?: string;
  /** Short human-readable title — distinct from `altText` (accessibility/fallback description) and `description` (longer contextual copy). */
  title?: string;
  description?: string;
  author?: string;
  copyright?: string;
  /** 0–5, IPTC-style rating convention. */
  rating?: number;
  typeMetadata?: MediaTypeMetadata;
  uploadedAt: string;
  uploadedBy?: string;
  /** Bumped on every General/SEO/Metadata patch — distinct from `uploadedAt`, which never changes after creation. */
  updatedAt?: string;
}
