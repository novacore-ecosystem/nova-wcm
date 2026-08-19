"use client";

import { useState } from "react";

import { contentEvaluationService } from "@/features/article/ai/ai-evaluation.service";
import type { ContentEvaluationResult } from "@/features/article/ai/ai-evaluation.types";

export type ContentEvaluationState =
  | { status: "empty" }
  | { status: "notConfigured" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; result: ContentEvaluationResult };

export function useContentEvaluation(input: { articleId?: string; title: string; content: string; seoTitle?: string; seoDescription?: string }) {
  const [state, setState] = useState<ContentEvaluationState>({ status: "empty" });

  async function analyze() {
    if (!contentEvaluationService.isConfigured()) {
      setState({ status: "notConfigured" });
      return;
    }
    setState({ status: "loading" });
    try {
      const result = await contentEvaluationService.analyze(input);
      setState({ status: "ready", result });
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : "Analysis failed" });
    }
  }

  return { state, analyze };
}
