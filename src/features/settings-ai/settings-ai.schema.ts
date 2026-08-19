import { z } from "zod";

export const aiTenantSettingsSchema = z.object({
  mode: z.enum(["managed", "byok"]),
  provider: z.enum(["openai", "anthropic", "gemini"]).optional(),
  defaultModel: z.string().optional().or(z.literal("")),
  contentModel: z.string().optional().or(z.literal("")),
  supportModel: z.string().optional().or(z.literal("")),
  apiKey: z.string().optional().or(z.literal("")),
});
export type AiTenantSettingsFormValues = z.infer<typeof aiTenantSettingsSchema>;
