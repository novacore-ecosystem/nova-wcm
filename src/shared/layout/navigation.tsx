import type { ReactNode } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Newspaper,
  Tags,
  Image as ImageIcon,
  Globe,
  Navigation as NavigationIcon,
  Search,
  Settings,
  Share2,
  KeyRound,
  Users,
  Network,
} from "lucide-react";
import { Permissions } from "@novacore/frontend-foundation";
import { createAccessControlNavigation, type NavigationGroup } from "@novacore/frontend-next-shadcn";

export type NavigationConfig = NavigationGroup[];

/** Icons for the shared Access Control module's nav entries — item ids are fixed by `createAccessControlNavigation`. */
const ACCESS_CONTROL_ICONS: Record<string, ReactNode> = {
  "access-control-permissions": <KeyRound className="h-4 w-4" />,
  "access-control-roles": <Users className="h-4 w-4" />,
  "access-control-positions": <Network className="h-4 w-4" />,
};

/**
 * Built from the shared package's `createAccessControlNavigation` (section 8/15 of the shared
 * module's docs) rather than hand-defined — its three entries are already gated on the real
 * backend permission keys (`AccessControlPermissions.permission/role/position.view`), not
 * `Permissions.Root` like the rest of this file (see the module's doc comment on why Position's
 * keys are forward-looking placeholders). Only `collapsible` + icons are WCM-owned additions.
 */
const baseAccessControlGroup = createAccessControlNavigation("/access-control");
const accessControlGroup: NavigationGroup = {
  ...baseAccessControlGroup,
  collapsible: true,
  items: baseAccessControlGroup.items.map((item) => ({ ...item, icon: ACCESS_CONTROL_ICONS[item.id] })),
};

/**
 * Gated on `Permissions.Root` throughout — no granular WCM permission keys exist in the shared
 * registry yet (see docs/plan.md §15), matching the precedent nova-console set for its own
 * ungoverned domains (`subscriptions`, `console`) before their backends existed. Replace with
 * real `content:*`/`catalog:*`/`website:*` keys once the backend defines them.
 *
 * Every titled group is `collapsible` — open/closed state persists per group `id` via
 * `useSidebarPreferences`, so `id` here is a storage key: never rename one without expecting
 * existing users' persisted state for it to silently reset.
 */
export const navigationConfig: NavigationConfig = [
  {
    id: "root",
    items: [{ id: "dashboard", label: "Dashboard", href: "/", icon: <LayoutDashboard className="h-4 w-4" /> }],
  },
  {
    id: "catalog",
    title: "Catalog",
    collapsible: true,
    items: [
      { id: "products", label: "Products", href: "/catalog/products", permission: Permissions.Root, icon: <Package className="h-4 w-4" /> },
      {
        id: "catalog-categories",
        label: "Categories",
        href: "/catalog/categories",
        permission: Permissions.Root,
        icon: <FolderTree className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "content",
    title: "Content",
    collapsible: true,
    items: [
      { id: "articles", label: "Articles", href: "/content/articles", permission: Permissions.Root, icon: <Newspaper className="h-4 w-4" /> },
      {
        id: "content-categories",
        label: "Categories",
        href: "/content/categories",
        permission: Permissions.Root,
        icon: <FolderTree className="h-4 w-4" />,
      },
      { id: "tags", label: "Tags", href: "/content/tags", permission: Permissions.Root, icon: <Tags className="h-4 w-4" /> },
    ],
  },
  {
    id: "media-group",
    items: [{ id: "media", label: "Media", href: "/media", permission: Permissions.Root, icon: <ImageIcon className="h-4 w-4" /> }],
  },
  {
    id: "website",
    title: "Website",
    collapsible: true,
    items: [
      { id: "pages", label: "Pages", href: "/website/pages", permission: Permissions.Root, icon: <Globe className="h-4 w-4" /> },
      {
        id: "navigation",
        label: "Navigation",
        href: "/website/navigation",
        permission: Permissions.Root,
        icon: <NavigationIcon className="h-4 w-4" />,
      },
      { id: "seo", label: "SEO", href: "/website/seo", permission: Permissions.Root, icon: <Search className="h-4 w-4" /> },
    ],
  },
  accessControlGroup,
  {
    id: "settings-group",
    title: "Settings",
    collapsible: true,
    items: [
      {
        id: "settings-general",
        label: "General",
        href: "/settings/general",
        permission: Permissions.Root,
        icon: <Settings className="h-4 w-4" />,
      },
      {
        id: "settings-social",
        label: "Social links",
        href: "/settings/social",
        permission: Permissions.Root,
        icon: <Share2 className="h-4 w-4" />,
      },
    ],
  },
];
