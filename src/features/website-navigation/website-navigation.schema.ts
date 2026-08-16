import { z } from "zod";

export const navigationItemSchema = z.object({
  label: z.string().min(1, "Vui lòng nhập tên mục"),
  url: z.string().min(1, "Vui lòng nhập đường dẫn"),
});
export type NavigationItemFormValues = z.infer<typeof navigationItemSchema>;
