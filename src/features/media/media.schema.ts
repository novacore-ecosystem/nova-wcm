import { z } from "zod";

export const uploadMediaSchema = z.object({
  fileName: z.string().min(1, "Vui lòng nhập tên tệp"),
  altText: z.string().optional(),
});
export type UploadMediaFormValues = z.infer<typeof uploadMediaSchema>;

export const editMediaAltTextSchema = z.object({
  altText: z.string().optional(),
});
export type EditMediaAltTextFormValues = z.infer<typeof editMediaAltTextSchema>;
