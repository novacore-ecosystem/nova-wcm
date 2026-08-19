export interface ContentBrief {
  objective: string;
  topic: string;
  audience?: string;
  keywords?: string;
  tone?: string;
  language?: string;
  contentType?: string;
  constraints?: string;
}

export interface ContentIdea {
  title: string;
  angle: string;
  outline: string[];
  keywords: string[];
}

export class AiIdeationNotConfiguredError extends Error {
  constructor() {
    super("Content ideation is not available: no AI Service is connected for this tenant yet.");
    this.name = "AiIdeationNotConfiguredError";
  }
}

/** App-level contract for the future NovaCore AI Service's ideation endpoint — never a provider SDK directly. */
export interface AiIdeationService {
  isConfigured(): boolean;
  generateIdeas(brief: ContentBrief): Promise<ContentIdea[]>;
}
