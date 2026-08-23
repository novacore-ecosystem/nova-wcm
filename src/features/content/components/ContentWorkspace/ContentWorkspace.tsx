"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge, Button, ConfirmDialog, FormActions, LoadingState, PageContainer, PageHeader, Tabs, TabsContent, TabsList, TabsTrigger } from "@novacore/frontend-next-shadcn";

import { Form } from "@/shared/forms";
import { useAppTranslation } from "@/shared/i18n";
import { useContentWorkspace, type ContentWorkspaceTab } from "@/features/content/components/ContentWorkspace/useContentWorkspace";
import { BasicInfoTab } from "@/features/content/components/ContentWorkspace/tabs/BasicInfoTab";
import { WritingTab } from "@/features/content/components/ContentWorkspace/tabs/WritingTab";
import { VersionsTab } from "@/features/content/components/ContentWorkspace/tabs/VersionsTab";
import { TranslationsTab } from "@/features/content/components/ContentWorkspace/tabs/TranslationsTab";
import { CONTENT_STATUS_TONE } from "@/features/content/lib/contentStatusTone";

export function ContentWorkspace({ contentId }: { contentId?: string }) {
  const { t } = useAppTranslation();
  const workspace = useContentWorkspace(contentId);
  const { isEditing, isLoadingDetail, detail, activeTab, setActiveTab, createForm, onCreateSubmit, isCreating, createError, onDelete, onRestoreContent, isDeleting, isRestoringContent } = workspace;
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (isLoadingDetail) return <LoadingState />;

  if (isEditing) {
    return (
      <PageContainer>
        <div className="flex flex-col gap-6">
          <PageHeader
            title={detail?.slug ?? t("content.editTitle", "Edit content")}
            description={t("content.editDescription", "Manage this content item's versions, languages, and publish state.")}
            actions={
              <div className="flex items-center gap-2">
                {detail ? (
                  <Badge variant={CONTENT_STATUS_TONE[detail.status]} className="capitalize">
                    {detail.status}
                  </Badge>
                ) : null}
                {detail?.isDeleted ? (
                  <Button size="sm" variant="outline" loading={isRestoringContent} onClick={() => void onRestoreContent()}>
                    {t("content.restore", "Restore")}
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDelete(true)}>
                    <Trash2 className="mr-1.5 size-4 text-destructive" />
                    {t("content.delete", "Delete")}
                  </Button>
                )}
              </div>
            }
          />

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContentWorkspaceTab)}>
            <TabsList>
              <TabsTrigger value="basicInfo">{t("content.tabBasicInfo", "Basic info")}</TabsTrigger>
              <TabsTrigger value="writing">{t("content.tabWriting", "Writing")}</TabsTrigger>
              <TabsTrigger value="versions">{t("content.tabVersions", "Versions")}</TabsTrigger>
              <TabsTrigger value="translations">{t("content.tabTranslations", "Translations")}</TabsTrigger>
            </TabsList>
            <TabsContent value="basicInfo">
              <BasicInfoTab workspace={workspace} />
            </TabsContent>
            <TabsContent value="writing">
              <WritingTab workspace={workspace} />
            </TabsContent>
            <TabsContent value="versions">
              <VersionsTab workspace={workspace} />
            </TabsContent>
            <TabsContent value="translations">
              <TranslationsTab workspace={workspace} />
            </TabsContent>
          </Tabs>
        </div>

        <ConfirmDialog
          open={confirmDelete}
          onOpenChange={setConfirmDelete}
          title={t("content.deleteTitle", "Delete this content?")}
          description={t("content.deleteDescription", "It will be hidden everywhere but can be restored later, until the retention job permanently removes it.")}
          confirmLabel={t("content.delete", "Delete")}
          loading={isDeleting}
          onConfirm={async () => {
            await onDelete();
            setConfirmDelete(false);
          }}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <PageHeader title={t("content.newTitle", "Create content")} description={t("content.newDescription", "Pick a type, write your content, and save — you can publish once it's ready.")} />

        <Form form={createForm} onSubmit={onCreateSubmit} className="flex flex-col gap-6">
          <Tabs value={activeTab === "versions" || activeTab === "translations" ? "basicInfo" : activeTab} onValueChange={(value) => setActiveTab(value as ContentWorkspaceTab)}>
            <TabsList>
              <TabsTrigger value="basicInfo">{t("content.tabBasicInfo", "Basic info")}</TabsTrigger>
              <TabsTrigger value="writing">{t("content.tabWriting", "Writing")}</TabsTrigger>
            </TabsList>
            <TabsContent value="basicInfo">
              <BasicInfoTab workspace={workspace} />
            </TabsContent>
            <TabsContent value="writing">
              <WritingTab workspace={workspace} />
            </TabsContent>
          </Tabs>

          {createError ? (
            <p role="alert" className="text-sm text-destructive">
              {createError}
            </p>
          ) : null}

          <FormActions>
            <Button type="submit" loading={isCreating}>
              {t("content.create", "Create content")}
            </Button>
          </FormActions>
        </Form>
      </div>
    </PageContainer>
  );
}
