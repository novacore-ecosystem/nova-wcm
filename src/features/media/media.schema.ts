import { z } from "zod";

export const uploadMediaSchema = z.object({
  fileName: z.string().min(1, "Vui lòng nhập tên tệp"),
  altText: z.string().optional(),
});
export type UploadMediaFormValues = z.infer<typeof uploadMediaSchema>;

/**
 * Media editing is split into independently-savable sections — General (read-only, no form),
 * SEO, and Metadata — each mapping to its own conceptual PATCH so unrelated fields never travel
 * in the same request. See docs' §17 (patch-based media editing).
 */
export const editMediaSeoSchema = z.object({
  altText: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
});
export type EditMediaSeoFormValues = z.infer<typeof editMediaSeoSchema>;

export const editMediaMetadataSchema = z.object({
  author: z.string().optional(),
  copyright: z.string().optional(),
  rating: z.preprocess((value) => (value === "" || value === undefined ? undefined : Number(value)), z.number().min(0).max(5).optional()),
  durationSeconds: z.preprocess((value) => (value === "" || value === undefined ? undefined : Number(value)), z.number().min(0).optional()),
  pageCount: z.preprocess((value) => (value === "" || value === undefined ? undefined : Number(value)), z.number().min(0).optional()),
});
export type EditMediaMetadataFormValues = z.infer<typeof editMediaMetadataSchema>;
