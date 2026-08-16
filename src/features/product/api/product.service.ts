import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { productCollection, type Product } from "@/services/product";
import { productCategoryCollection } from "@/services/product-category";
import type { ProductFormValues } from "@/features/product/product.schema";

/** Mirrors what a real API would do server-side: resolve the denormalized category name at write time (see docs/plan.md §9 — no client-side join for reads). */
async function resolveCategoryName(categoryId: string): Promise<string> {
  const category = await productCategoryCollection.get(categoryId);
  return category.name;
}

export const productService = {
  list: (request: CriteriaRequest) => productCollection.list(request),
  get: (id: string) => productCollection.get(id),
  create: async (values: ProductFormValues) => {
    const categoryName = await resolveCategoryName(values.categoryId);
    const product: Product = {
      id: `prod-${values.slug}-${Date.now()}`,
      name: values.name,
      slug: values.slug,
      shortDescription: values.shortDescription || undefined,
      description: values.description || undefined,
      categoryId: values.categoryId,
      categoryName,
      featured: values.featured,
      status: values.status,
      seoTitle: values.seoTitle || undefined,
      seoDescription: values.seoDescription || undefined,
      coverImageUrl: values.coverImageUrl || undefined,
      updatedAt: new Date().toISOString(),
    };
    return productCollection.create(product);
  },
  update: async (id: string, values: ProductFormValues) => {
    const categoryName = await resolveCategoryName(values.categoryId);
    return productCollection.update(id, {
      name: values.name,
      slug: values.slug,
      shortDescription: values.shortDescription || undefined,
      description: values.description || undefined,
      categoryId: values.categoryId,
      categoryName,
      featured: values.featured,
      status: values.status,
      seoTitle: values.seoTitle || undefined,
      seoDescription: values.seoDescription || undefined,
      coverImageUrl: values.coverImageUrl || undefined,
      updatedAt: new Date().toISOString(),
    });
  },
  remove: (id: string) => productCollection.remove(id),
};
