export type MediaKind = "image" | "document";

export interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  thumbnailUrl?: string;
  mimeType: string;
  sizeBytes: number;
  kind: MediaKind;
  width?: number;
  height?: number;
  altText?: string;
  uploadedAt: string;
}
