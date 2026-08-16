export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive";
  articleCount: number;
  updatedAt: string;
}
