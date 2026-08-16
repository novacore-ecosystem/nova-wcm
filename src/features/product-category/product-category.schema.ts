import { z } from "zod";
import { SLUG_REGEX } from "@novacore/frontend-foundation";

export const productCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(80, "Keep it under 80 characters"),
  slug: z.string().min(1, "Slug is required").regex(SLUG_REGEX, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().max(240, "Keep it under 240 characters").optional().or(z.literal("")),
  status: z.enum(["active", "inactive"]),
});

export type ProductCategoryFormValues = z.infer<typeof productCategorySchema>;
