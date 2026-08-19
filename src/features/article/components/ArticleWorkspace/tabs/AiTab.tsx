"use client";

import Link from "next/link";
import { ArrowRight, Lightbulb, MessagesSquare, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { ContentEvaluationCard } from "@/features/article/components/ArticleWorkspace/ai/ContentEvaluationCard";
import type { useArticleWorkspace } from "@/features/article/components/ArticleWorkspace/useArticleWorkspace";

export function AiTab({ workspace }: { workspace: ReturnType<typeof useArticleWorkspace> }) {
  const { t } = useAppTranslation();
  const { evaluation, setActiveTab } = workspace;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ContentEvaluationCard state={evaluation.state} onAnalyze={evaluation.analyze} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Sparkles className="size-4 text-primary" />
            {t("article.aiWritingAssistant", "AI writing assistant")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <p>
            {t(
              "article.aiWritingAssistantBody",
              "Improve, rewrite, expand, shorten, translate, and more — available as actions in the Writing tab. Every suggestion is shown next to your original text; nothing is applied until you accept it.",
            )}
          </p>
          <button type="button" onClick={() => setActiveTab("writing")} className="flex items-center gap-1.5 self-start text-xs font-medium text-primary hover:underline">
            {t("article.openWritingTab", "Open the Writing tab")}
            <ArrowRight className="size-3.5" />
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Lightbulb className="size-4 text-primary" />
            {t("article.aiIdeation", "Content ideation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <p>{t("article.aiIdeationBody", "Need ideas before you write? Describe your goal, audience, and topic — get title, outline, and angle suggestions.")}</p>
          <Link href="/ai/ideas" className="flex items-center gap-1.5 self-start text-xs font-medium text-primary hover:underline">
            {t("article.openIdeation", "Open Content Ideation")}
            <ArrowRight className="size-3.5" />
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <MessagesSquare className="size-4 text-primary" />
            {t("article.aiContext", "AI context")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <p>{t("article.aiContextBody", "AI actions use your tenant's brand, product, and writing-style context automatically. Manage that context centrally.")}</p>
          <Link href="/ai/context" className="flex items-center gap-1.5 self-start text-xs font-medium text-primary hover:underline">
            {t("article.openContext", "Manage AI context")}
            <ArrowRight className="size-3.5" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
