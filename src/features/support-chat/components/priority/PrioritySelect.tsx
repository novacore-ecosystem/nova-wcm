"use client";

import { Select } from "@novacore/frontend-next-shadcn";

import type { ConversationPriority } from "@/services/support-chat";

const OPTIONS: { value: ConversationPriority; label: string }[] = [
  { value: "normal", label: "Normal" },
  { value: "important", label: "Important" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export function PrioritySelect({ value, onChange, disabled, id = "conversation-priority" }: { value: ConversationPriority; onChange: (value: ConversationPriority) => void; disabled?: boolean; id?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <label htmlFor={id} className="sr-only">
        Priority
      </label>
      <Select id={id} className="h-8 w-28 text-xs" value={value} onValueChange={(next) => onChange(next as ConversationPriority)} options={OPTIONS} disabled={disabled} />
    </div>
  );
}
