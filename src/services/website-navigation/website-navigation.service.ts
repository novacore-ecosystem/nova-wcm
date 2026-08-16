import { simulateLatency } from "@/shared/lib/mock/simulateLatency";
import type { WebsiteNavigationMenu, WebsiteNavigationMenuId } from "@/services/website-navigation/website-navigation.types";

/** Two fixed named menus (no create/delete-menu flow — matches docs/plan.md's "not a page builder" scope). */
let state: Record<WebsiteNavigationMenuId, WebsiteNavigationMenu> = {
  main: {
    id: "main",
    name: "Menu chính",
    items: [
      { id: "nav-main-1", label: "Trang chủ", url: "/", order: 1, visible: true },
      { id: "nav-main-2", label: "Giới thiệu", url: "/gioi-thieu", order: 2, visible: true },
      { id: "nav-main-3", label: "Sản phẩm", url: "/san-pham", order: 3, visible: true },
      { id: "nav-main-4", label: "Bài viết", url: "/bai-viet", order: 4, visible: true },
      { id: "nav-main-5", label: "Liên hệ", url: "/lien-he", order: 5, visible: true },
    ],
  },
  footer: {
    id: "footer",
    name: "Menu chân trang",
    items: [
      { id: "nav-footer-1", label: "Chính sách bảo hành", url: "/chinh-sach-bao-hanh", order: 1, visible: true },
      { id: "nav-footer-2", label: "Điều khoản sử dụng", url: "/dieu-khoan-su-dung", order: 2, visible: true },
      { id: "nav-footer-3", label: "Liên hệ", url: "/lien-he", order: 3, visible: true },
    ],
  },
};

export async function getWebsiteNavigationMenu(menuId: WebsiteNavigationMenuId): Promise<WebsiteNavigationMenu> {
  return simulateLatency(state[menuId]);
}

export async function updateWebsiteNavigationMenu(
  menuId: WebsiteNavigationMenuId,
  items: WebsiteNavigationMenu["items"],
): Promise<WebsiteNavigationMenu> {
  const updated: WebsiteNavigationMenu = { ...state[menuId], items };
  state = { ...state, [menuId]: updated };
  return simulateLatency(updated);
}
