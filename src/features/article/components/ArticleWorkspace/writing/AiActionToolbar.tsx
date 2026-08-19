"use client";

import { AlignLeft, Languages, ListTree, Maximize2, Minimize2, PenLine, Sparkles, SpellCheck2, Wand2 } from "lucide-react";
import { Button } from "@novacore/frontend-next-shadcn";

import type { AiContentActionType } from "@/features/article/ai/ai-content.types";

const ACTIONS: { type: AiContentActionType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "improve", label: "Improve", icon: Wand2 },
  { type: "rewrite", label: "Rewrite", icon: PenLine },
  { type: "expand", label: "Expand", icon: Maximize2 },
  { type: "shorten", label: "Shorten", icon: Minimize2 },
  { type: "correctGrammar", label: "Fix grammar", icon: SpellCheck2 },
  { type: "generateOutline", label: "Outline", icon: ListTree },
  { type: "summarize", label: "Summarize", icon: AlignLeft },
  { type: "translate", label: "Translate", icon: Languages },
];

export function AiActionToolbar({ onRunAction, busyAction }: { onRunAction: (action: AiContentActionType) => void; busyAction: AiContentActionType | null }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-dashed border-border bg-muted/30 p-2">
      <span className="flex items-center gap-1 pl-1 pr-2 text-xs font-medium text-muted-foreground">
        <Sparkles className="size-3.5" />
        AI actions
      </span>
      {ACTIONS.map(({ type, label, icon: Icon }) => (
        <Button key={type} type="button" variant="outline" size="sm" loading={busyAction === type} onClick={() => onRunAction(type)}>
          <Icon className="mr-1.5 size-3.5" />
          {label}
        </Button>
      ))}
    </div>
  );
}
