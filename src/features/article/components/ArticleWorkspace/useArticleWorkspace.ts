"use client";

import { useState } from "react";

import { useArticleForm } from "@/features/article/components/ArticleWorkspace/useArticleForm";
import { useAiWritingAssistant } from "@/features/article/ai/useAiWritingAssistant";
import { useContentEvaluation } from "@/features/article/ai/useContentEvaluation";

export type ArticleWorkspaceTab = "writing" | "information" | "seo" | "related" | "ai" | "publishing";

export function useArticleWorkspace(articleId?: string) {
  const [activeTab, setActiveTab] = useState<ArticleWorkspaceTab>("writing");
  const articleForm = useArticleForm(articleId);
  const { form } = articleForm;

  const content = form.watch("content");
  const setContent = (value: string) => form.setValue("content", value, { shouldDirty: true, shouldValidate: true });
  const aiWriting = useAiWritingAssistant(content, setContent);

  const values = form.watch();
  const evaluation = useContentEvaluation({
    articleId,
    title: values.title,
    content: values.content,
    seoTitle: values.seoTitle,
    seoDescription: values.seoDescription,
  });

  return {
    ...articleForm,
    activeTab,
    setActiveTab,
    aiWriting,
    evaluation,
  };
}
