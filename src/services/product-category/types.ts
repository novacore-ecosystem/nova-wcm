export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: "active" | "inactive";
  productCount: number;
  updatedAt: string;
}
