import type { ThemeConfig, ThemeTokens } from "@novacore/frontend-next-shadcn";

/**
 * A warm, editorial sidebar chrome — distinct from nova-console's navy — so this product reads
 * as "website & brand management," not "ops console," at a glance. Omits `primary`/`ring`/
 * `sidebar-primary` so the active-nav accent keeps tracking `color` (see WCM_ADMIN_THEME).
 */
export const WCM_CHROME_OVERRIDES: Partial<ThemeTokens> = {
  sidebar: "30 25% 15%",
  "sidebar-foreground": "30 15% 96%",
  "sidebar-border": "30 20% 24%",
  "sidebar-accent": "30 22% 21%",
  "sidebar-accent-foreground": "0 0% 100%",
};

/**
 * nova-wcm's design baseline. See docs/plan.md §5 — warm amber/orange accent on a neutral base,
 * restrained (accent color drives primary actions, active nav, and key states only). Built from
 * `frontend-next-shadcn`'s existing `neutral-orange` preset values rather than inventing new
 * tokens (see `packages/shadcn/src/theme/presets.ts`), with nova-wcm's own chrome override.
 */
export const WCM_ADMIN_THEME: ThemeConfig = {
  base: "neutral",
  color: "orange",
  style: "modern",
  radius: "large",
  overrides: WCM_CHROME_OVERRIDES,
};
