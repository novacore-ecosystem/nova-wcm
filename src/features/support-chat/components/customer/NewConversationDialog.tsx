"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@novacore/frontend-next-shadcn";

import { useCreateConversationMutation } from "@/features/support-chat/api/support-chat.queries";
import { CustomerOnboardingForm } from "@/features/support-chat/components/customer/CustomerOnboardingForm";
import { customerIdentityService } from "@/services/support-chat";
import type { CustomerOnboardingFormValues } from "@/features/support-chat/support-chat.schema";

/**
 * Demonstrates the anonymous-visitor entry flow (§5.1) end-to-end: this admin app has no public
 * landing page of its own to host the real widget, so this dialog stands in for "a visitor clicks
 * Chat on the landing page" — the resulting conversation lands in the Unassigned pool exactly like
 * a real one would.
 */
export function NewConversationDialog({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (open: boolean) => void; onCreated: (conversationId: string) => void }) {
  const createMutation = useCreateConversationMutation();

  async function handleSubmit(values: CustomerOnboardingFormValues) {
    const identity = customerIdentityService.fromOnboarding(values);
    const conversation = await createMutation.mutateAsync(identity);
    onOpenChange(false);
    onCreated(conversation.id);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a conversation</DialogTitle>
          <DialogDescription>Simulates a landing-page visitor starting a human-support chat.</DialogDescription>
        </DialogHeader>
        <CustomerOnboardingForm onSubmit={handleSubmit} isSubmitting={createMutation.isPending} />
      </DialogContent>
    </Dialog>
  );
}
