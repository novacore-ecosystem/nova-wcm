import { AiEvaluationNotConfiguredError, type ContentEvaluationService } from "@/features/article/ai/ai-evaluation.types";

/**
 * Placeholder adapter, same honesty standard as `ai-content.service.ts` — real scoring
 * (SEO/readability/structure/etc.) requires a real AI Service backend that does not exist yet.
 * No score is ever fabricated on the frontend.
 */
export const contentEvaluationService: ContentEvaluationService = {
  isConfigured: () => false,
  async analyze() {
    throw new AiEvaluationNotConfiguredError();
  },
};
