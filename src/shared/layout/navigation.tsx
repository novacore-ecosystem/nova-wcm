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
} from "lucide-react";
import { Permissions } from "@novacore/frontend-foundation";
import type { NavigationGroup } from "@novacore/frontend-next-shadcn";

export type NavigationConfig = NavigationGroup[];

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
