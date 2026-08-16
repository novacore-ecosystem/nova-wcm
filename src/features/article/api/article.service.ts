import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { articleCollection, type Article } from "@/services/article";
import { articleCategoryCollection } from "@/services/article-category";
import { tagCollection } from "@/services/tag";
import type { ArticleFormValues } from "@/features/article/article.schema";

async function resolveClassification(values: ArticleFormValues) {
  const [categories, tags] = await Promise.all([articleCategoryCollection.listAll(), tagCollection.listAll()]);
  const category = values.categoryId ? categories.find((item) => item.id === values.categoryId) : undefined;
  const tags_ = tags.filter((tag) => values.tagIds.includes(tag.id));
  return {
    categoryId: category?.id,
    categoryName: category?.name,
    tagIds: tags_.map((tag) => tag.id),
    tagNames: tags_.map((tag) => tag.name),
  };
}

export const articleService = {
  list: (request: CriteriaRequest) => articleCollection.list(request),
  get: (id: string) => articleCollection.get(id),

  async create(values: ArticleFormValues) {
    const classification = await resolveClassification(values);
    const now = new Date().toISOString();
    const article: Article = {
      id: `art-${values.slug}-${Date.now()}`,
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt || "",
      content: values.content,
      coverImageUrl: values.coverImageUrl || undefined,
      ...classification,
      author: values.author,
      featured: values.featured,
      status: values.status,
      publishedAt: values.status === "published" ? values.publishedAt || now : undefined,
      updatedAt: now,
      views: 0,
      seoTitle: values.seoTitle || undefined,
      seoDescription: values.seoDescription || undefined,
      canonicalUrl: values.canonicalUrl || undefined,
    };
    return articleCollection.create(article);
  },

  async update(id: string, values: ArticleFormValues) {
    const classification = await resolveClassification(values);
    const now = new Date().toISOString();
    const existing = await articleCollection.get(id);
    return articleCollection.update(id, {
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt || "",
      content: values.content,
      coverImageUrl: values.coverImageUrl || undefined,
      ...classification,
      author: values.author,
      featured: values.featured,
      status: values.status,
      publishedAt: values.status === "published" ? values.publishedAt || existing.publishedAt || now : undefined,
      updatedAt: now,
      seoTitle: values.seoTitle || undefined,
      seoDescription: values.seoDescription || undefined,
      canonicalUrl: values.canonicalUrl || undefined,
    });
  },

  remove: (id: string) => articleCollection.remove(id),
};
