"use client";

import { MessageCircle } from "lucide-react";
import { Button, FormField, Input, Textarea } from "@novacore/frontend-next-shadcn";

import { Form, useAppForm } from "@/shared/forms";
import { customerOnboardingSchema, type CustomerOnboardingFormValues } from "@/features/support-chat/support-chat.schema";

const DEFAULT_VALUES: CustomerOnboardingFormValues = { name: "", email: "", phone: "", address: "" };

/**
 * What an anonymous landing-page visitor sees before entering a human-support chat — friendly
 * onboarding, not an enterprise intake form. Extensible: add a field to the schema/here without
 * touching the conversation model itself (it just carries a `CustomerIdentity`).
 */
export function CustomerOnboardingForm({ onSubmit, isSubmitting }: { onSubmit: (values: CustomerOnboardingFormValues) => void | Promise<void>; isSubmitting: boolean }) {
  const form = useAppForm(customerOnboardingSchema, { defaultValues: DEFAULT_VALUES });

  return (
    <div className="grid gap-4">
      <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-3">
        <MessageCircle className="mt-0.5 size-5 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">A few details so a consultant can help you faster and follow up if the chat gets interrupted.</p>
      </div>
      <Form form={form} onSubmit={onSubmit} className="grid gap-3">
        <FormField label="Your name" htmlFor="onboardingName" required error={form.formState.errors.name?.message}>
          <Input id="onboardingName" {...form.register("name")} placeholder="Nguyễn Văn A" />
        </FormField>
        <FormField label="Phone number" htmlFor="onboardingPhone" required error={form.formState.errors.phone?.message}>
          <Input id="onboardingPhone" {...form.register("phone")} placeholder="09xx xxx xxx" />
        </FormField>
        <FormField label="Email" htmlFor="onboardingEmail" error={form.formState.errors.email?.message}>
          <Input id="onboardingEmail" type="email" {...form.register("email")} placeholder="you@example.com" />
        </FormField>
        <FormField label="Address" htmlFor="onboardingAddress" description="Optional — helps with delivery questions.">
          <Textarea id="onboardingAddress" rows={2} {...form.register("address")} />
        </FormField>
        <Button type="submit" loading={isSubmitting} className="mt-1">
          Start chatting
        </Button>
      </Form>
    </div>
  );
}
