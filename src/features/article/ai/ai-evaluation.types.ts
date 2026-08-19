export type ContentEvaluationSeverity = "info" | "warning" | "critical";

export interface ContentEvaluationCategoryScore {
  key: "seo" | "readability" | "structure" | "keywordUsage" | "titleQuality" | "descriptionQuality" | "completeness";
  label: string;
  score: number;
  maxScore: number;
}

export interface ContentEvaluationIssue {
  id: string;
  severity: ContentEvaluationSeverity;
  message: string;
}

export interface ContentEvaluationResult {
  overallScore: number;
  maxScore: number;
  categories: ContentEvaluationCategoryScore[];
  issues: ContentEvaluationIssue[];
  suggestions: string[];
  analyzedAt: string;
}

export class AiEvaluationNotConfiguredError extends Error {
  constructor() {
    super("Content analysis is not available: no AI Service is connected for this tenant yet.");
    this.name = "AiEvaluationNotConfiguredError";
  }
}

export interface ContentEvaluationService {
  isConfigured(): boolean;
  analyze(input: { articleId?: string; title: string; content: string; seoTitle?: string; seoDescription?: string }): Promise<ContentEvaluationResult>;
}
