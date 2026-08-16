export interface WebsiteNavigationItem {
  id: string;
  label: string;
  url: string;
  order: number;
  visible: boolean;
}

export type WebsiteNavigationMenuId = "main" | "footer";

export interface WebsiteNavigationMenu {
  id: WebsiteNavigationMenuId;
  name: string;
  items: WebsiteNavigationItem[];
}
