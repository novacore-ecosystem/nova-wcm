import { z } from "zod";
import { SLUG_REGEX } from "@novacore/frontend-foundation";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Keep it under 120 characters"),
  slug: z.string().min(1, "Slug is required").regex(SLUG_REGEX, "Use lowercase letters, numbers, and hyphens only"),
  categoryId: z.string().min(1, "Please select a category"),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
  shortDescription: z.string().max(160, "Keep it under 160 characters — this shows in product lists").optional().or(z.literal("")),
  description: z.string().max(2000, "Keep it under 2000 characters").optional().or(z.literal("")),
  seoTitle: z.string().max(60, "Keep it under 60 characters so it doesn't get cut off in search results").optional().or(z.literal("")),
  seoDescription: z
    .string()
    .max(160, "Keep it under 160 characters so it doesn't get cut off in search results")
    .optional()
    .or(z.literal("")),
  coverImageUrl: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
});

export type ProductFormValues = z.infer<typeof productSchema>;
