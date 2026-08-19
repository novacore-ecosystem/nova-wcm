import { z } from "zod";

export const handoverRequestSchema = z.object({
  toAgentId: z.string().min(1, "Choose a colleague to hand this over to"),
  reason: z.string().max(400, "Keep it under 400 characters").optional().or(z.literal("")),
});
export type HandoverRequestFormValues = z.infer<typeof handoverRequestSchema>;

export const AI_SKILLS = ["General FAQ", "Product information", "Order information", "Shipping information", "Basic troubleshooting"] as const;

export const aiModeSchema = z.object({
  skills: z.array(z.string()).min(1, "Pick at least one skill AI is allowed to help with"),
  context: z.string().max(600, "Keep it under 600 characters").optional().or(z.literal("")),
});
export type AiModeFormValues = z.infer<typeof aiModeSchema>;

export const customerOnboardingSchema = z.object({
  name: z.string().min(1, "Tell us your name"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().min(1, "A phone number helps us follow up"),
  address: z.string().optional().or(z.literal("")),
});
export type CustomerOnboardingFormValues = z.infer<typeof customerOnboardingSchema>;
