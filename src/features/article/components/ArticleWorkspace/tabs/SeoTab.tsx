"use client";

import { CheckCircle2, CircleAlert, Sparkles } from "lucide-react";
import { FormField, FormSection, Input, Textarea } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import { SeoResultPreview } from "@/features/article/components/ArticleWorkspace/SeoResultPreview";
import type { useArticleWorkspace } from "@/features/article/components/ArticleWorkspace/useArticleWorkspace";

/** Deterministic length/presence checks — not AI. Deeper AI-assisted SEO analysis lives in the AI tab's content evaluation panel. */
function useSeoChecklist(title: string, description: string, canonicalUrl: string) {
  return [
    { ok: title.length > 0 && title.length <= 60, label: `Meta title is ${title.length}/60 characters` },
    { ok: description.length >= 120 && description.length <= 160, label: `Meta description is ${description.length}/160 characters (aim for 120-160)` },
    { ok: !canonicalUrl || canonicalUrl.startsWith("http"), label: "Canonical URL is a full, valid link" },
  ];
}

export function SeoTab({ workspace }: { workspace: ReturnType<typeof useArticleWorkspace> }) {
  const { t } = useAppTranslation();
  const { form, setActiveTab } = workspace;
  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const values = watch();
  const effectiveTitle = values.seoTitle || values.title;
  const effectiveDescription = values.seoDescription || values.excerpt || "";
  const checklist = useSeoChecklist(effectiveTitle, effectiveDescription, values.canonicalUrl || "");

  return (
    <div className="grid gap-6">
      <FormSection title={t("article.seo", "SEO")} description={t("article.seoDescriptionHelp", "Help your article show up well in search results.")}>
        <FormField
          label={t("article.seoTitle", "Meta title")}
          htmlFor="seoTitle"
          description={t("article.seoTitleHelp", `${values.seoTitle?.length ?? 0}/70 — aim for 50-60 characters.`)}
          error={errors.seoTitle?.message}
        >
          <Input id="seoTitle" {...register("seoTitle")} placeholder={values.title} />
        </FormField>
        <FormField
          label={t("article.seoDescription", "Meta description")}
          htmlFor="seoDescription"
          description={t("article.seoDescriptionHelpText", `${values.seoDescription?.length ?? 0}/170 — aim for 150-160 characters.`)}
          error={errors.seoDescription?.message}
        >
          <Textarea id="seoDescription" rows={2} {...register("seoDescription")} placeholder={values.excerpt} />
        </FormField>
        <SeoResultPreview title={effectiveTitle} description={effectiveDescription} slug={values.slug} />
        <FormField
          label={t("article.canonicalUrl", "Canonical URL")}
          htmlFor="canonicalUrl"
          description={t("article.canonicalUrlHelp", "Optional — only needed if this article is also published elsewhere.")}
          error={errors.canonicalUrl?.message}
        >
          <Input id="canonicalUrl" {...register("canonicalUrl")} placeholder="https://…" />
        </FormField>
      </FormSection>

      <FormSection title={t("article.seoChecklist", "Quick checklist")}>
        <ul className="grid gap-2">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center gap-2 text-sm">
              {item.ok ? <CheckCircle2 className="size-4 shrink-0 text-success" /> : <CircleAlert className="size-4 shrink-0 text-warning" />}
              <span className={item.ok ? "text-muted-foreground" : ""}>{item.label}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className="flex items-center gap-1.5 self-start text-xs font-medium text-primary hover:underline"
        >
          <Sparkles className="size-3.5" />
          {t("article.seoAiHint", "Want a deeper AI-powered SEO score? Open the AI tab.")}
        </button>
      </FormSection>
    </div>
  );
}
