"use client";

import { ArrowRightLeft } from "lucide-react";
import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, FormField, Select, Textarea } from "@novacore/frontend-next-shadcn";

import { Form, useAppForm } from "@/shared/forms";
import { handoverRequestSchema, type HandoverRequestFormValues } from "@/features/support-chat/support-chat.schema";
import type { SupportAgent } from "@/services/support-chat";

/** A collaboration/invitation flow, not an administrative reassignment form — framed as "hand this over to a colleague", with an optional note for context. */
export function HandoverDialog({
  open,
  onOpenChange,
  agents,
  onSubmit,
  isSubmitting,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agents: SupportAgent[];
  onSubmit: (values: HandoverRequestFormValues) => void | Promise<void>;
  isSubmitting: boolean;
}) {
  const form = useAppForm(handoverRequestSchema, { defaultValues: { toAgentId: "", reason: "" } });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="size-4" />
            Hand over this conversation
          </DialogTitle>
          <DialogDescription>Your colleague will see this as a request they can accept or decline.</DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit} className="grid gap-4">
          <FormField label="Hand over to" htmlFor="toAgentId" required error={form.formState.errors.toAgentId?.message}>
            <Select
              value={form.watch("toAgentId") || undefined}
              onValueChange={(value) => form.setValue("toAgentId", value)}
              placeholder="Choose a colleague"
              options={agents.map((agent) => ({ value: agent.id, label: agent.name }))}
            />
          </FormField>
          <FormField label="Note for your colleague" htmlFor="reason" description="Optional — context about why, or what to be careful about.">
            <Textarea id="reason" rows={3} {...form.register("reason")} />
          </FormField>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Send request
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
