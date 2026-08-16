import { simulateLatency } from "@/shared/lib/mock/simulateLatency";
import type { GeneralSettings } from "@/services/settings-general/settings-general.types";

let state: GeneralSettings = {
  siteName: "Nova Home",
  logoUrl: "https://picsum.photos/seed/nova-logo-2026/480/320",
  faviconUrl: "https://picsum.photos/seed/favicon-icon/480/320",
  contactEmail: "lienhe@novahome.vn",
  contactPhone: "1900 6868",
  contactAddress: "123 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
};

export async function getGeneralSettings(): Promise<GeneralSettings> {
  return simulateLatency(state);
}

export async function updateGeneralSettings(patch: Partial<GeneralSettings>): Promise<GeneralSettings> {
  state = { ...state, ...patch };
  return simulateLatency(state);
}
