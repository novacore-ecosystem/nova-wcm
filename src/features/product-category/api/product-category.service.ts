import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { productCategoryCollection, type ProductCategory } from "@/services/product-category";
import type { ProductCategoryFormValues } from "@/features/product-category/product-category.schema";

export const productCategoryService = {
  list: (request: CriteriaRequest) => productCategoryCollection.list(request),
  listAll: () => productCategoryCollection.listAll(),
  get: (id: string) => productCategoryCollection.get(id),
  create: (values: ProductCategoryFormValues) => {
    const category: ProductCategory = {
      id: `pcat-${values.slug}-${Date.now()}`,
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
      status: values.status,
      productCount: 0,
      updatedAt: new Date().toISOString(),
    };
    return productCategoryCollection.create(category);
  },
  update: (id: string, values: ProductCategoryFormValues) =>
    productCategoryCollection.update(id, {
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
      status: values.status,
      updatedAt: new Date().toISOString(),
    }),
  remove: (id: string) => productCategoryCollection.remove(id),
};
