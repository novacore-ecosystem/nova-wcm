import { z } from "zod";

export const contentBriefSchema = z.object({
  objective: z.string().min(1, "Tell us what this content should achieve"),
  topic: z.string().min(1, "Topic is required"),
  audience: z.string().optional().or(z.literal("")),
  keywords: z.string().optional().or(z.literal("")),
  tone: z.string().optional().or(z.literal("")),
  language: z.string().optional().or(z.literal("")),
  contentType: z.string().optional().or(z.literal("")),
  constraints: z.string().optional().or(z.literal("")),
});

export type ContentBriefFormValues = z.infer<typeof contentBriefSchema>;
