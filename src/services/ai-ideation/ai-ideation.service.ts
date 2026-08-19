import { AiIdeationNotConfiguredError, type AiIdeationService } from "@/services/ai-ideation/ai-ideation.types";

/** Placeholder — no AI Service exists for WCM yet. Swap for an `httpClient` adapter once one does; the `AiIdeationService` interface is the contract the page already codes against. */
export const aiIdeationService: AiIdeationService = {
  isConfigured: () => false,
  async generateIdeas() {
    throw new AiIdeationNotConfiguredError();
  },
};
