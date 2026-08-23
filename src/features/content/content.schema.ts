import { z } from "zod";
import { SLUG_REGEX } from "@novacore/frontend-foundation";

const editorJsBlockSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.record(z.string(), z.unknown()),
});

export const editorJsDocumentSchema = z.object({
  time: z.number().optional(),
  version: z.string().optional(),
  blocks: z.array(editorJsBlockSchema),
});

export const CONTENT_VISIBILITY_VALUES = ["public", "authenticated", "internal", "restricted", "private"] as const;

/**
 * Create form — `contentTypeId`/`slug`/`visibility` have no update endpoint on the backend (only
 * `Title`/`Summary`/`Body`/`Language` are accepted by `UpdateContentDraftRequest`), so they're only
 * ever collected here, never re-submitted through `contentDraftFormSchema`.
 */
export const contentCreateFormSchema = z.object({
  contentTypeId: z.string().min(1, "Content type is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(SLUG_REGEX, "Use lowercase letters, numbers, and hyphens only"),
  language: z.string().optional().or(z.literal("")),
  title: z.string().min(1, "Title is required").max(200, "Keep it under 200 characters"),
  summary: z.string().min(1, "Summary is required").max(500, "Keep it under 500 characters"),
  body: editorJsDocumentSchema.refine((doc) => doc.blocks.length > 0, { message: "Write something before saving" }),
  visibility: z.enum(CONTENT_VISIBILITY_VALUES).default("private"),
});

export type ContentCreateFormValues = z.infer<typeof contentCreateFormSchema>;

/** Draft edit form — one language's editable content on a specific version. */
export const contentDraftFormSchema = z.object({
  language: z.string().optional().or(z.literal("")),
  title: z.string().min(1, "Title is required").max(200, "Keep it under 200 characters"),
  summary: z.string().min(1, "Summary is required").max(500, "Keep it under 500 characters"),
  body: editorJsDocumentSchema.refine((doc) => doc.blocks.length > 0, { message: "Write something before saving" }),
});

export type ContentDraftFormValues = z.infer<typeof contentDraftFormSchema>;

/** Translation form — adds/updates one target language on an existing version. */
export const contentTranslateFormSchema = z.object({
  targetLanguage: z.string().min(1, "Target language is required"),
  title: z.string().min(1, "Title is required").max(200, "Keep it under 200 characters"),
  summary: z.string().min(1, "Summary is required").max(500, "Keep it under 500 characters"),
  body: editorJsDocumentSchema.refine((doc) => doc.blocks.length > 0, { message: "Write something before saving" }),
});

export type ContentTranslateFormValues = z.infer<typeof contentTranslateFormSchema>;
