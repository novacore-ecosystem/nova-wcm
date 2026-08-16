import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { articleCategoryCollection, type ArticleCategory } from "@/services/article-category";
import type { ArticleCategoryFormValues } from "@/features/article-category/article-category.schema";

export const articleCategoryService = {
  list: (request: CriteriaRequest) => articleCategoryCollection.list(request),
  listAll: () => articleCategoryCollection.listAll(),
  get: (id: string) => articleCategoryCollection.get(id),
  create: (values: ArticleCategoryFormValues) => {
    const category: ArticleCategory = {
      id: `cat-${values.slug}-${Date.now()}`,
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
      status: values.status,
      articleCount: 0,
      updatedAt: new Date().toISOString(),
    };
    return articleCategoryCollection.create(category);
  },
  update: (id: string, values: ArticleCategoryFormValues) =>
    articleCategoryCollection.update(id, {
      name: values.name,
      slug: values.slug,
      description: values.description || undefined,
      status: values.status,
      updatedAt: new Date().toISOString(),
    }),
  remove: (id: string) => articleCategoryCollection.remove(id),
};
