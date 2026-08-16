import { z } from "zod";

const optionalUrl = z.string().url("URL không hợp lệ").optional().or(z.literal(""));

export const socialLinksSchema = z.object({
  facebookUrl: optionalUrl,
  youtubeUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  zaloUrl: optionalUrl,
  tiktokUrl: optionalUrl,
});
export type SocialLinksFormValues = z.infer<typeof socialLinksSchema>;
