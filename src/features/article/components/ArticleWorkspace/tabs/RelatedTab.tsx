"use client";

import Link from "next/link";
import { ExternalLink, LinkIcon } from "lucide-react";
import { cn, EmptyState, FormField, FormSection } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { useArticleWorkspace } from "@/features/article/components/ArticleWorkspace/useArticleWorkspace";

export function RelatedTab({ workspace }: { workspace: ReturnType<typeof useArticleWorkspace> }) {
  const { t } = useAppTranslation();
  const { form, otherArticles, toggleRelatedArticle } = workspace;
  const relatedArticleIds = form.watch("relatedArticleIds");
  const selected = otherArticles.filter((article) => relatedArticleIds.includes(article.id));

  return (
    <div className="grid gap-6">
      <FormSection
        title={t("article.related", "Related articles")}
        description={t("article.relatedDescription", "Link this article to others readers might also want — shown as an internal cross-link section.")}
      >
        {otherArticles.length === 0 ? (
          <EmptyState icon={<LinkIcon className="h-8 w-8" />} title={t("article.relatedEmpty", "No other articles yet")} />
        ) : (
          <FormField label={t("article.chooseRelated", "Choose related articles")}>
            <div className="grid max-h-80 gap-1.5 overflow-y-auto rounded-md border border-border p-2">
              {otherArticles.map((article) => {
                const isSelected = relatedArticleIds.includes(article.id);
                return (
                  <button
                    key={article.id}
                    type="button"
                    onClick={() => toggleRelatedArticle(article.id)}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                      isSelected ? "border-primary bg-primary/10" : "border-transparent hover:bg-accent",
                    )}
                  >
                    <span className="truncate">{article.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{article.status}</span>
                  </button>
                );
              })}
            </div>
          </FormField>
        )}
      </FormSection>

      {selected.length > 0 ? (
        <FormSection title={t("article.relatedSelected", "Selected")}>
          <ul className="grid gap-1.5">
            {selected.map((article) => (
              <li key={article.id}>
                <Link href={`/content/articles/${article.id}`} target="_blank" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                  {article.title}
                  <ExternalLink className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </FormSection>
      ) : null}
    </div>
  );
}
