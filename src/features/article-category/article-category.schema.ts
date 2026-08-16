import { z } from "zod";

export const articleCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(80, "Keep it under 80 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().max(240, "Keep it under 240 characters").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

export type ArticleCategoryFormValues = z.infer<typeof articleCategorySchema>;
