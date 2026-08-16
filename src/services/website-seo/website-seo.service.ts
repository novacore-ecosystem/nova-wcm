import { simulateLatency } from "@/shared/lib/mock/simulateLatency";
import type { WebsiteSeoSettings } from "@/services/website-seo/website-seo.types";

let state: WebsiteSeoSettings = {
  defaultMetaTitle: "Nova Home — Nội thất gỗ tự nhiên cho gia đình Việt",
  defaultMetaDescription:
    "Cửa hàng nội thất gỗ tự nhiên: bàn ghế, giường tủ, phụ kiện trang trí. Thiết kế tối giản, bền đẹp, giá hợp lý, giao hàng toàn quốc.",
  defaultSocialImageUrl: "https://picsum.photos/seed/nova-home-social-cover/1200/630",
  robotsIndexable: true,
};

export async function getWebsiteSeoSettings(): Promise<WebsiteSeoSettings> {
  return simulateLatency(state);
}

export async function updateWebsiteSeoSettings(patch: Partial<WebsiteSeoSettings>): Promise<WebsiteSeoSettings> {
  state = { ...state, ...patch };
  return simulateLatency(state);
}
