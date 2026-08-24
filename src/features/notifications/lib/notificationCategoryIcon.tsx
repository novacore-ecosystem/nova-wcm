import { Bell, FileText, Settings, ShoppingBag, UserRound } from "lucide-react";
import type { ComponentType } from "react";

/**
 * `category` is a free-text string on the backend (`NotificationDto.Category` — no enum/catalog
 * published, see `notification.mappers.ts`'s doc comment), same convention admin-portal's own
 * `NotificationIcon` documents for the same field. Presentation-only: a few conventional values
 * get a themed icon, anything unrecognized falls back to a generic bell rather than guessing.
 */
const CATEGORY_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  order: ShoppingBag,
  content: FileText,
  system: Settings,
  account: UserRound,
  user: UserRound,
};

export function notificationCategoryIcon(category: string): ComponentType<{ className?: string }> {
  return CATEGORY_ICONS[category.toLowerCase()] ?? Bell;
}
