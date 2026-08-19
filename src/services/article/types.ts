export type ArticleStatus = "draft" | "published";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  categoryId?: string;
  categoryName?: string;
  tagIds: string[];
  tagNames: string[];
  author: string;
  featured: boolean;
  status: ArticleStatus;
  publishedAt?: string;
  updatedAt: string;
  views: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  /** Scheduled future publish time — distinct from `publishedAt`, which is only set once the article actually goes live. */
  scheduledAt?: string;
  relatedArticleIds: string[];
}
