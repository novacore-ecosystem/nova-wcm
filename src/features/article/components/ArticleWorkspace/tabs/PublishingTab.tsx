"use client";

import { FormField, FormSection, Input, RelativeTime, Select, Switch } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { useArticleWorkspace } from "@/features/article/components/ArticleWorkspace/useArticleWorkspace";

export function PublishingTab({ workspace }: { workspace: ReturnType<typeof useArticleWorkspace> }) {
  const { t } = useAppTranslation();
  const { form } = workspace;
  const values = form.watch();

  return (
    <div className="grid gap-6">
      <FormSection title={t("article.publishing", "Publishing")}>
        <FormField label={t("article.status", "Status")} htmlFor="status">
          <Select
            value={values.status}
            onValueChange={(value) => form.setValue("status", value as "draft" | "published")}
            options={[
              { value: "draft", label: t("article.draft", "Draft") },
              { value: "published", label: t("article.published", "Published") },
            ]}
          />
        </FormField>

        {values.status === "draft" ? (
          <FormField
            label={t("article.scheduledAt", "Schedule publish")}
            htmlFor="scheduledAt"
            description={t("article.scheduledAtHelp", "Optional — a target time for publishing later. No automatic publish job runs yet, this is a plan you record for now.")}
          >
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={values.scheduledAt ? values.scheduledAt.slice(0, 16) : ""}
              onChange={(event) => form.setValue("scheduledAt", event.target.value)}
            />
          </FormField>
        ) : (
          <FormField label={t("article.publishedAt", "Published at")}>
            <p className="text-sm text-muted-foreground">
              {values.publishedAt ? <RelativeTime date={values.publishedAt} /> : t("article.publishedNow", "Will be set to now on save")}
            </p>
          </FormField>
        )}

        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <div>
            <p className="text-sm font-medium">{t("article.featured", "Featured")}</p>
            <p className="text-xs text-muted-foreground">{t("article.featuredHelp", "Highlight this article on the homepage.")}</p>
          </div>
          <Switch checked={values.featured} onCheckedChange={(checked) => form.setValue("featured", checked)} />
        </div>
      </FormSection>
    </div>
  );
}
