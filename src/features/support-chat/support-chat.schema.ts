import { z } from "zod";

export const AI_SKILLS = ["General FAQ", "Product information", "Order information", "Shipping information", "Basic troubleshooting"] as const;

/** AI holding-mode config — local component state only, see `AiModeConfig`'s doc comment in `support-chat.types.ts` for why (no backend endpoint persists this). */
export const aiModeSchema = z.object({
  skills: z.array(z.string()).min(1, "Pick at least one skill AI is allowed to help with"),
  context: z.string().max(600, "Keep it under 600 characters").optional().or(z.literal("")),
});
export type AiModeFormValues = z.infer<typeof aiModeSchema>;
