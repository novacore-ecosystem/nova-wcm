"use client";

import { useState } from "react";

import { aiContentService } from "@/features/article/ai/ai-content.service";
import type { AiContentActionType } from "@/features/article/ai/ai-content.types";

export type AiWritingAssistantState =
  | { status: "idle" }
  | { status: "notConfigured"; action: AiContentActionType }
  | { status: "loading"; action: AiContentActionType }
  | { status: "error"; action: AiContentActionType; message: string }
  | { status: "ready"; action: AiContentActionType; original: string; suggestion: string };

/**
 * Owns the Original vs AI-Suggested workflow: an AI action never touches `currentContent`
 * directly — it only ever produces a suggestion the caller must explicitly accept. Accepting
 * keeps a one-step restore point so a bad accept can be undone without reaching for browser undo.
 */
export function useAiWritingAssistant(currentContent: string, setContent: (value: string) => void) {
  const [state, setState] = useState<AiWritingAssistantState>({ status: "idle" });
  const [restorePoint, setRestorePoint] = useState<string | null>(null);

  async function runAction(action: AiContentActionType) {
    if (!aiContentService.isConfigured()) {
      setState({ status: "notConfigured", action });
      return;
    }
    setState({ status: "loading", action });
    try {
      const result = await aiContentService.runAction({ type: action, content: currentContent });
      setState({ status: "ready", action, original: currentContent, suggestion: result.suggestion });
    } catch (error) {
      setState({ status: "error", action, message: error instanceof Error ? error.message : "AI request failed" });
    }
  }

  function acceptSuggestion() {
    if (state.status !== "ready") return;
    setRestorePoint(state.original);
    setContent(state.suggestion);
    setState({ status: "idle" });
  }

  function dismissSuggestion() {
    setState({ status: "idle" });
  }

  function restorePrevious() {
    if (restorePoint === null) return;
    setContent(restorePoint);
    setRestorePoint(null);
  }

  return { state, runAction, acceptSuggestion, dismissSuggestion, restorePrevious, canRestore: restorePoint !== null };
}
