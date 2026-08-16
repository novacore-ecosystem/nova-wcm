import { z } from "zod";

export const tagSchema = z.object({
  name: z.string().min(1, "Name is required").max(40, "Keep it under 40 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
});

export type TagFormValues = z.infer<typeof tagSchema>;
