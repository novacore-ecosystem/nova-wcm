import { z } from "zod";

export const uploadMediaSchema = z.object({
  fileName: z.string().min(1, "Vui lòng nhập tên tệp"),
  altText: z.string().optional(),
});
export type UploadMediaFormValues = z.infer<typeof uploadMediaSchema>;

export const editMediaMetadataSchema = z.object({
  altText: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  copyright: z.string().optional(),
  rating: z.preprocess((value) => (value === "" || value === undefined ? undefined : Number(value)), z.number().min(0).max(5).optional()),
});
export type EditMediaMetadataFormValues = z.infer<typeof editMediaMetadataSchema>;
