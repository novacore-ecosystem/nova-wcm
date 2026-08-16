import { simulateLatency } from "@/shared/lib/mock/simulateLatency";
import type { SocialLinksSettings } from "@/services/settings-social/settings-social.types";

let state: SocialLinksSettings = {
  facebookUrl: "https://facebook.com/novahome.vn",
  youtubeUrl: "https://youtube.com/@novahome",
  linkedinUrl: "",
  zaloUrl: "https://zalo.me/novahome",
  tiktokUrl: "https://tiktok.com/@novahome.vn",
};

export async function getSocialLinksSettings(): Promise<SocialLinksSettings> {
  return simulateLatency(state);
}

export async function updateSocialLinksSettings(patch: Partial<SocialLinksSettings>): Promise<SocialLinksSettings> {
  state = { ...state, ...patch };
  return simulateLatency(state);
}
