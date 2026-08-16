import { z } from "zod";

export const websitePageSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề trang"),
  slug: z
    .string()
    .min(1, "Vui lòng nhập đường dẫn")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Đường dẫn chỉ gồm chữ thường, số và dấu gạch ngang"),
  content: z.string().min(1, "Vui lòng nhập nội dung trang"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});
export type WebsitePageFormValues = z.infer<typeof websitePageSchema>;
