"use client";

import { Bot, Info } from "lucide-react";
import { Badge, Button, Checkbox, FormField, Popover, Textarea } from "@novacore/frontend-next-shadcn";

import { Form, useAppForm } from "@/shared/forms";
import { AI_SKILLS, aiModeSchema, type AiModeFormValues } from "@/features/support-chat/support-chat.schema";
import type { AiConversationState } from "@/services/support-chat";

const STATE_LABEL: Record<AiConversationState, { label: string; variant: "outline" | "info" | "success" | "warning" }> = {
  disabled: { label: "AI disabled", variant: "outline" },
  holding: { label: "AI holding", variant: "info" },
  humanActive: { label: "Human active", variant: "success" },
  handover: { label: "Handover in progress", variant: "warning" },
};

/**
 * Enables/reconfigures AI holding mode — skills it may answer with + free-text guidance. No real
 * AI Service is wired up: this only sets `aiMode` state on the conversation, it never triggers
 * actual generation. See `AiModeConfig`'s doc comment on `services/support-chat`.
 */
export function AiModeControl({
  state,
  skills,
  context,
  onEnable,
  onDisable,
  isSaving,
}: {
  state: AiConversationState;
  skills: string[];
  context?: string;
  onEnable: (values: AiModeFormValues) => void;
  onDisable: () => void;
  isSaving: boolean;
}) {
  const form = useAppForm(aiModeSchema, { defaultValues: { skills, context: context ?? "" } });

  function toggleSkill(skill: string, checked: boolean) {
    const current = form.getValues("skills");
    form.setValue("skills", checked ? [...current, skill] : current.filter((s) => s !== skill));
  }

  return (
    <Popover
      align="end"
      trigger={
        <Button variant="outline" size="sm">
          <Bot className="mr-1.5 size-3.5" />
          <Badge variant={STATE_LABEL[state].variant} className="pointer-events-none">
            {STATE_LABEL[state].label}
          </Badge>
        </Button>
      }
      className="w-80"
    >
      <Form form={form} onSubmit={onEnable} className="grid gap-3">
        <div className="flex items-start gap-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          <p>Keeps the customer engaged while a consultant isn&apos;t immediately available. AI answers only within the skills below.</p>
        </div>
        <FormField label="Skills AI may help with" error={form.formState.errors.skills?.message}>
          <div className="grid gap-1.5">
            {AI_SKILLS.map((skill) => {
              const checked = form.watch("skills").includes(skill);
              return (
                <label key={skill} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={checked} onCheckedChange={(value) => toggleSkill(skill, value === true)} />
                  {skill}
                </label>
              );
            })}
          </div>
        </FormField>
        <FormField label="Additional context" htmlFor="aiContext" description="What should AI know or avoid deciding on its own?">
          <Textarea id="aiContext" rows={3} {...form.register("context")} />
        </FormField>
        <div className="flex items-center justify-between">
          {state !== "disabled" ? (
            <Button type="button" variant="ghost" size="sm" onClick={onDisable}>
              Turn off
            </Button>
          ) : (
            <span />
          )}
          <Button type="submit" size="sm" loading={isSaving}>
            {state === "disabled" ? "Enable AI holding" : "Update"}
          </Button>
        </div>
      </Form>
    </Popover>
  );
}
