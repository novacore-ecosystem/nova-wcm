import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Keep it under 120 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().max(220, "Keep it under 220 characters").optional().or(z.literal("")),
  content: z.string().min(1, "Write something before saving"),
  coverImageUrl: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  categoryId: z.string().optional().or(z.literal("")),
  tagIds: z.array(z.string()).default([]),
  author: z.string().min(1, "Author is required"),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional().or(z.literal("")),
  seoTitle: z.string().max(70, "Keep it under 70 characters").optional().or(z.literal("")),
  seoDescription: z.string().max(170, "Keep it under 170 characters").optional().or(z.literal("")),
  canonicalUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
