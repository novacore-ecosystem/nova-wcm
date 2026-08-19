export type AiMode = "managed" | "byok";
export type AiProvider = "openai" | "anthropic" | "gemini";

/**
 * Tenant-level AI configuration. `apiKeyConfigured` is the only trace of a BYOK key this app ever
 * holds — the actual key is never sent back from the mock, and a real backend must never return
 * plaintext secrets either. Nothing here talks to a provider SDK; this only configures which
 * provider/model the future NovaCore AI API should route to.
 */
export interface AiTenantSettings {
  mode: AiMode;
  provider: AiProvider | null;
  defaultModel?: string;
  contentModel?: string;
  supportModel?: string;
  apiKeyConfigured: boolean;
}
