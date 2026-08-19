import { AiServiceNotConfiguredError, type AiContentActionRequest, type AiContentActionResult, type AiContentService } from "@/features/article/ai/ai-content.types";

/**
 * Placeholder adapter: no NovaCore AI Service exists yet for any tenant, so this always reports
 * unconfigured and throws rather than fabricating a suggestion. Swap for an `httpClient` adapter
 * against the real AI Service once it exists — the `AiContentService` interface is the contract
 * callers already code against, so no UI changes should be needed at that point.
 */
export const aiContentService: AiContentService = {
  isConfigured: () => false,
  async runAction(request: AiContentActionRequest): Promise<AiContentActionResult> {
    throw new AiServiceNotConfiguredError(request.type);
  },
};
