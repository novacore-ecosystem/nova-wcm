import type { CriteriaRequest } from "@novacore/frontend-foundation";

import { tagCollection, type Tag } from "@/services/tag";
import type { TagFormValues } from "@/features/tag/tag.schema";

export const tagService = {
  list: (request: CriteriaRequest) => tagCollection.list(request),
  listAll: () => tagCollection.listAll(),
  create: (values: TagFormValues) => {
    const tag: Tag = { id: `tag-${values.slug}-${Date.now()}`, name: values.name, slug: values.slug, articleCount: 0 };
    return tagCollection.create(tag);
  },
  update: (id: string, values: TagFormValues) => tagCollection.update(id, { name: values.name, slug: values.slug }),
  remove: (id: string) => tagCollection.remove(id),
};
