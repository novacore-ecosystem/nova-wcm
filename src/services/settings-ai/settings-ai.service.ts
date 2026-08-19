import { simulateLatency } from "@/shared/lib/mock/simulateLatency";
import type { AiTenantSettings } from "@/services/settings-ai/settings-ai.types";

let state: AiTenantSettings = {
  mode: "managed",
  provider: null,
  apiKeyConfigured: false,
};

export async function getAiTenantSettings(): Promise<AiTenantSettings> {
  return simulateLatency(state);
}

/**
 * `apiKey`, if present, is applied as "configured" and immediately discarded — never stored,
 * never echoed back. A real backend must apply the same rule: accept a write-only secret, persist
 * it wherever secrets are actually kept (never in this settings record), and only ever report
 * whether one is set.
 */
export async function updateAiTenantSettings(patch: Partial<Omit<AiTenantSettings, "apiKeyConfigured">> & { apiKey?: string }): Promise<AiTenantSettings> {
  const { apiKey, ...rest } = patch;
  state = { ...state, ...rest, apiKeyConfigured: apiKey ? true : state.apiKeyConfigured };
  return simulateLatency(state);
}
