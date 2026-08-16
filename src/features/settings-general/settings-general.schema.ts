import { z } from "zod";

export const generalSettingsSchema = z.object({
  siteName: z.string().min(1, "Vui lòng nhập tên website"),
  logoUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
  faviconUrl: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
  contactEmail: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
});
export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
