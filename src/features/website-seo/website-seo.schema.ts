import { z } from "zod";

export const websiteSeoSchema = z.object({
  defaultMetaTitle: z.string().min(1, "Vui lòng nhập tiêu đề mặc định"),
  defaultMetaDescription: z.string().min(1, "Vui lòng nhập mô tả mặc định"),
  defaultSocialImageUrl: z.string().min(1, "Vui lòng nhập URL ảnh chia sẻ").url("URL ảnh không hợp lệ"),
  robotsIndexable: z.boolean(),
});
export type WebsiteSeoFormValues = z.infer<typeof websiteSeoSchema>;
