export type WebsitePageStatus = "draft" | "published";

export interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  status: WebsitePageStatus;
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt: string;
}
