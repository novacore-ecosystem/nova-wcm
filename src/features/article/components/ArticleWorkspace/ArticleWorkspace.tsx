"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  FormActions,
  LoadingState,
  PageContainer,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useArticleWorkspace, type ArticleWorkspaceTab } from "@/features/article/components/ArticleWorkspace/useArticleWorkspace";
import { WritingTab } from "@/features/article/components/ArticleWorkspace/tabs/WritingTab";
import { InformationTab } from "@/features/article/components/ArticleWorkspace/tabs/InformationTab";
import { SeoTab } from "@/features/article/components/ArticleWorkspace/tabs/SeoTab";
import { RelatedTab } from "@/features/article/components/ArticleWorkspace/tabs/RelatedTab";
import { AiTab } from "@/features/article/components/ArticleWorkspace/tabs/AiTab";
import { PublishingTab } from "@/features/article/components/ArticleWorkspace/tabs/PublishingTab";

/**
 * The Article Workspace: a tabbed shell so the writing experience stays compact as more
 * capability areas (AI, related content, publishing config, ...) get added — none of them grow
 * this page vertically, each just gets its own tab. See docs/plan.md and .wolf/STATUS.md.
 */
export function ArticleWorkspace({ articleId }: { articleId?: string }) {
  const { t } = useAppTranslation();
  const workspace = useArticleWorkspace(articleId);
  const { form, onSubmit, isEditing, isLoadingExisting, isSubmitting, errorMessage, activeTab, setActiveTab } = workspace;

  if (isLoadingExisting) return <LoadingState />;

  const values = form.watch();

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={isEditing ? t("article.editTitle", "Edit article") : t("article.newTitle", "Write article")}
          description={t("article.formDescription", "Write for your reader first — a clear title and a helpful summary go a long way.")}
          actions={<Badge variant={values.status === "published" ? "success" : "outline"}>{values.status === "published" ? t("article.published", "Published") : t("article.draft", "Draft")}</Badge>}
        />

        <Form form={form} onSubmit={onSubmit} className="flex flex-col gap-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ArticleWorkspaceTab)}>
            <TabsList>
              <TabsTrigger value="writing">{t("article.tabWriting", "Writing")}</TabsTrigger>
              <TabsTrigger value="information">{t("article.tabInformation", "Information")}</TabsTrigger>
              <TabsTrigger value="seo">{t("article.tabSeo", "SEO")}</TabsTrigger>
              <TabsTrigger value="related">{t("article.tabRelated", "Related")}</TabsTrigger>
              <TabsTrigger value="ai">{t("article.tabAi", "AI")}</TabsTrigger>
              <TabsTrigger value="publishing">{t("article.tabPublishing", "Publishing")}</TabsTrigger>
            </TabsList>

            <TabsContent value="writing">
              <WritingTab workspace={workspace} />
            </TabsContent>
            <TabsContent value="information">
              <InformationTab workspace={workspace} />
            </TabsContent>
            <TabsContent value="seo">
              <SeoTab workspace={workspace} />
            </TabsContent>
            <TabsContent value="related">
              <RelatedTab workspace={workspace} />
            </TabsContent>
            <TabsContent value="ai">
              <AiTab workspace={workspace} />
            </TabsContent>
            <TabsContent value="publishing">
              <PublishingTab workspace={workspace} />
            </TabsContent>
          </Tabs>

          {errorMessage ? (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}

          <FormActions>
            <Button variant="outline" type="button" asChild>
              <Link href="/content/articles">{t("common.cancel", "Cancel")}</Link>
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {values.status === "published" ? t("article.publish", "Publish") : t("common.saveDraft", "Save draft")}
            </Button>
          </FormActions>
        </Form>
      </div>
    </PageContainer>
  );
}
