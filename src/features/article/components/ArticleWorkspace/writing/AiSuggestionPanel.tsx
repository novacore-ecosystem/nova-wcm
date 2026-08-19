"use client";

import { AlertTriangle, Check, Sparkles, X } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@novacore/frontend-next-shadcn";

import type { AiWritingAssistantState } from "@/features/article/ai/useAiWritingAssistant";
import { renderMarkdownLite } from "@/features/article/lib/renderMarkdownLite";

const ACTION_LABELS: Record<string, string> = {
  improve: "Improve",
  rewrite: "Rewrite",
  expand: "Expand",
  shorten: "Shorten",
  changeTone: "Change tone",
  correctGrammar: "Fix grammar",
  generateIntro: "Generate introduction",
  generateConclusion: "Generate conclusion",
  generateTitle: "Generate title",
  generateOutline: "Generate outline",
  translate: "Translate",
  summarize: "Summarize",
};

/**
 * Renders every non-idle state of `useAiWritingAssistant`. Nothing here ever mutates the
 * article's content directly — "Use this suggestion" is the one path that does, and it goes
 * through the caller's `onAccept`, which the hook wires to its own accept handler.
 */
export function AiSuggestionPanel({
  state,
  onAccept,
  onDismiss,
}: {
  state: AiWritingAssistantState;
  onAccept: () => void;
  onDismiss: () => void;
}) {
  if (state.status === "idle") return null;

  if (state.status === "notConfigured") {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 pt-6">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div className="flex-1 text-sm">
            <p className="font-medium">
              {ACTION_LABELS[state.action] ?? state.action} isn&apos;t available yet
            </p>
            <p className="mt-1 text-muted-foreground">
              This workspace is wired up for AI writing actions, but no AI Service is connected for this tenant yet. Once one
              is, this button will produce a suggestion here — never overwrite your draft directly.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss} aria-label="Dismiss">
            <X className="size-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (state.status === "loading") {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center gap-3 pt-6 text-sm text-muted-foreground">
          <Sparkles className="size-4 animate-pulse" />
          Generating {ACTION_LABELS[state.action]?.toLowerCase() ?? state.action} suggestion…
        </CardContent>
      </Card>
    );
  }

  if (state.status === "error") {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" />
          <div className="flex-1 text-sm">
            <p className="font-medium text-destructive">Something went wrong</p>
            <p className="mt-1 text-muted-foreground">{state.message}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onDismiss} aria-label="Dismiss">
            <X className="size-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="size-4 text-primary" />
          {ACTION_LABELS[state.action] ?? state.action} suggestion
        </CardTitle>
        <Badge variant="outline">Preview — not applied yet</Badge>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Original</p>
          <div className="max-h-64 overflow-y-auto rounded-md border border-border bg-muted/30 p-3">{renderMarkdownLite(state.original)}</div>
        </div>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-primary">AI suggested</p>
          <div className="max-h-64 overflow-y-auto rounded-md border border-primary/40 bg-primary/5 p-3">{renderMarkdownLite(state.suggestion)}</div>
        </div>
      </CardContent>
      <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-3">
        <Button variant="outline" size="sm" onClick={onDismiss}>
          <X className="mr-1.5 size-3.5" />
          Reject
        </Button>
        <Button size="sm" onClick={onAccept}>
          <Check className="mr-1.5 size-3.5" />
          Use this suggestion
        </Button>
      </div>
    </Card>
  );
}
