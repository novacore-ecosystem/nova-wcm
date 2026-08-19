"use client";

import { AlertCircle, BarChart3, Info, RefreshCcw, Sparkles } from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, RelativeTime } from "@novacore/frontend-next-shadcn";

import type { ContentEvaluationState } from "@/features/article/ai/useContentEvaluation";

function ScoreBar({ label, score, maxScore }: { label: string; score: number; maxScore: number }) {
  const percent = Math.round((score / maxScore) * 100);
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {score}/{maxScore}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function ContentEvaluationCard({ state, onAnalyze, compact }: { state: ContentEvaluationState; onAnalyze: () => void; compact?: boolean }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2 text-sm">
          <BarChart3 className="size-4 text-primary" />
          Content evaluation
        </CardTitle>
        {state.status === "ready" ? (
          <Button variant="ghost" size="sm" onClick={onAnalyze}>
            <RefreshCcw className="mr-1.5 size-3.5" />
            Re-analyze
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-3">
        {state.status === "empty" ? (
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-muted-foreground">Not analyzed yet. Run an analysis to get an SEO, readability, and structure score for this article.</p>
            <Button size="sm" variant="outline" onClick={onAnalyze}>
              <Sparkles className="mr-1.5 size-3.5" />
              Analyze
            </Button>
          </div>
        ) : null}

        {state.status === "notConfigured" ? (
          <div className="flex items-start gap-2.5 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p className="text-muted-foreground">
              Content analysis isn&apos;t connected yet — no AI Service is available for this tenant. This panel is ready to
              show real scores once one is.
            </p>
          </div>
        ) : null}

        {state.status === "loading" ? <p className="text-sm text-muted-foreground">Analyzing…</p> : null}

        {state.status === "error" ? (
          <div className="flex items-start gap-2.5 text-sm">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-destructive">{state.message}</p>
          </div>
        ) : null}

        {state.status === "ready" ? (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold">{state.result.overallScore}</span>
              <span className="text-sm text-muted-foreground">/ {state.result.maxScore} overall</span>
            </div>
            {!compact ? (
              <div className="grid gap-2.5">
                {state.result.categories.map((category) => (
                  <ScoreBar key={category.key} label={category.label} score={category.score} maxScore={category.maxScore} />
                ))}
              </div>
            ) : null}
            {state.result.issues.length > 0 ? (
              <div className="grid gap-1.5">
                {state.result.issues.map((issue) => (
                  <div key={issue.id} className="flex items-start gap-2 text-xs">
                    <Badge variant={issue.severity === "critical" ? "destructive" : issue.severity === "warning" ? "warning" : "outline"}>
                      {issue.severity}
                    </Badge>
                    <span className="text-muted-foreground">{issue.message}</span>
                  </div>
                ))}
              </div>
            ) : null}
            <p className="text-xs text-muted-foreground">
              Last analyzed <RelativeTime date={state.result.analyzedAt} />
            </p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
