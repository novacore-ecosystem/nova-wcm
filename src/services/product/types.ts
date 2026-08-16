export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  categoryId: string;
  categoryName: string;
  featured: boolean;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  coverImageUrl?: string;
  updatedAt: string;
}
