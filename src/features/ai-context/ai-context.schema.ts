import { z } from "zod";

export const AI_CONTEXT_CATEGORIES = [
  "brand",
  "company",
  "products",
  "writingStyle",
  "customerSupport",
  "seoRules",
  "businessRules",
  "workflowRules",
  "legal",
  "general",
] as const;

export const aiContextGroupSchema = z.object({
  name: z.string().min(1, "Name is required").max(80, "Keep it under 80 characters"),
  category: z.enum(AI_CONTEXT_CATEGORIES),
  scope: z.enum(["global", "group"]),
  content: z.string().min(1, "Add the context text this group should provide"),
});
export type AiContextGroupFormValues = z.infer<typeof aiContextGroupSchema>;

export const personalAiContextSchema = z.object({
  content: z.string().optional().or(z.literal("")),
});
export type PersonalAiContextFormValues = z.infer<typeof personalAiContextSchema>;
