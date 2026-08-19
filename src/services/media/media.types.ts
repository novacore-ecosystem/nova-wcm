export type MediaKind = "image" | "document";

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
  uploadedAt: string;
}
