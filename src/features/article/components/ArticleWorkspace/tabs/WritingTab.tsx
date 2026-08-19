"use client";

import { RotateCcw } from "lucide-react";
import { Button, FormField } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { RichTextEditor } from "@/features/article/components/ArticleWorkspace/writing/RichTextEditor";
import { AiActionToolbar } from "@/features/article/components/ArticleWorkspace/writing/AiActionToolbar";
import { AiSuggestionPanel } from "@/features/article/components/ArticleWorkspace/writing/AiSuggestionPanel";
import { ContentEvaluationCard } from "@/features/article/components/ArticleWorkspace/ai/ContentEvaluationCard";
import type { useArticleWorkspace } from "@/features/article/components/ArticleWorkspace/useArticleWorkspace";

function wordCount(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function WritingTab({ workspace }: { workspace: ReturnType<typeof useArticleWorkspace> }) {
  const { t } = useAppTranslation();
  const { form, aiWriting, evaluation } = workspace;
  const content = form.watch("content");
  const errors = form.formState.errors;
  const busyAction = aiWriting.state.status === "loading" ? aiWriting.state.action : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="grid gap-4">
        <AiActionToolbar onRunAction={aiWriting.runAction} busyAction={busyAction} />

        {aiWriting.state.status !== "idle" ? (
          <AiSuggestionPanel state={aiWriting.state} onAccept={aiWriting.acceptSuggestion} onDismiss={aiWriting.dismissSuggestion} />
        ) : null}

        <FormField error={errors.content?.message}>
          <RichTextEditor
            value={content}
            onChange={(value) => form.setValue("content", value, { shouldDirty: true, shouldValidate: true })}
            placeholder={t("article.contentPlaceholder", "Write naturally — this is the main writing workspace.")}
            invalid={!!errors.content}
          />
        </FormField>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t("article.wordCount", `${wordCount(content)} words`)}</span>
          {aiWriting.canRestore ? (
            <Button type="button" variant="ghost" size="sm" onClick={aiWriting.restorePrevious}>
              <RotateCcw className="mr-1.5 size-3.5" />
              {t("article.restorePrevious", "Restore version before last AI change")}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid content-start gap-4">
        <ContentEvaluationCard state={evaluation.state} onAnalyze={evaluation.analyze} compact />
      </div>
    </div>
  );
}
