/**
 * Contract for the future NovaCore AI Service, consumed through this app-level interface only —
 * never a provider SDK (OpenAI/Anthropic/Gemini) directly. See docs/plan.md and .wolf/STATUS.md
 * for why no implementation is wired up yet: no AI Service exists for WCM to call.
 */
export type AiContentActionType =
  | "improve"
  | "rewrite"
  | "expand"
  | "shorten"
  | "changeTone"
  | "correctGrammar"
  | "generateIntro"
  | "generateConclusion"
  | "generateTitle"
  | "generateOutline"
  | "translate"
  | "summarize";

export interface AiContentActionRequest {
  type: AiContentActionType;
  /** Full current draft content (markdown), the "Original" the suggestion will be diffed against. */
  content: string;
  /** Optional selected excerpt the action should apply to, instead of the whole document. */
  selection?: string;
  tone?: string;
  targetLanguage?: string;
}

export interface AiContentActionResult {
  suggestion: string;
  explanation?: string;
}

export class AiServiceNotConfiguredError extends Error {
  constructor(action: AiContentActionType) {
    super(`AI action "${action}" is not available: no AI Service is connected for this tenant yet.`);
    this.name = "AiServiceNotConfiguredError";
  }
}

export interface AiContentService {
  /** Whether a real backend AI Service is reachable for this tenant. Always false until one exists. */
  isConfigured(): boolean;
  runAction(request: AiContentActionRequest): Promise<AiContentActionResult>;
}
