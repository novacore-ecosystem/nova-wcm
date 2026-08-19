"use client";

import { useState } from "react";

import { useAppForm } from "@/shared/forms";
import { aiIdeationService, type ContentIdea } from "@/services/ai-ideation";
import { contentBriefSchema, type ContentBriefFormValues } from "@/features/ai-ideation/ai-ideation.schema";

type IdeationState = { status: "idle" } | { status: "notConfigured" } | { status: "loading" } | { status: "error"; message: string } | { status: "ready"; ideas: ContentIdea[] };

const DEFAULT_VALUES: ContentBriefFormValues = {
  objective: "",
  topic: "",
  audience: "",
  keywords: "",
  tone: "",
  language: "",
  contentType: "",
  constraints: "",
};

export function useContentIdeationPage() {
  const form = useAppForm(contentBriefSchema, { defaultValues: DEFAULT_VALUES });
  const [state, setState] = useState<IdeationState>({ status: "idle" });

  async function onSubmit(values: ContentBriefFormValues) {
    if (!aiIdeationService.isConfigured()) {
      setState({ status: "notConfigured" });
      return;
    }
    setState({ status: "loading" });
    try {
      const ideas = await aiIdeationService.generateIdeas(values);
      setState({ status: "ready", ideas });
    } catch (error) {
      setState({ status: "error", message: error instanceof Error ? error.message : "Request failed" });
    }
  }

  return { form, onSubmit, state };
}
