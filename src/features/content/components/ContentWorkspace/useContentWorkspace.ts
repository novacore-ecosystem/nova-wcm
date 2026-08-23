"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { HttpError } from "@novacore/frontend-foundation";

import { useAppForm } from "@/shared/forms";
import {
  contentCreateFormSchema,
  contentDraftFormSchema,
  contentTranslateFormSchema,
  type ContentCreateFormValues,
  type ContentDraftFormValues,
  type ContentTranslateFormValues,
} from "@/features/content/content.schema";
import {
  useContentDetailQuery,
  useContentTypesQuery,
  useContentVersionQuery,
  useCreateContentMutation,
  useCreateContentVersionMutation,
  useDeleteContentMutation,
  usePublishContentMutation,
  useRestoreContentMutation,
  useRestoreContentVersionMutation,
  useTranslateContentVersionMutation,
  useUpdateContentDraftMutation,
} from "@/features/content/api/content.queries";
import { EMPTY_EDITORJS_DOCUMENT } from "@/services/content";

export type ContentWorkspaceTab = "basicInfo" | "writing" | "versions" | "translations";

/** `UpdateContentDraft`'s own doc comment: "Only draft (non-published, non-archived) versions can be edited." Approved/InReview/Rejected are still pre-publish, so treated as editable too — only Published/Scheduled/Unpublished/Archived are not. */
const EDITABLE_VERSION_STATUSES = new Set(["draft", "inReview", "approved", "rejected"]);

function errorMessageOf(error: unknown): string | null {
  if (!error) return null;
  return error instanceof HttpError ? error.message : "Something went wrong";
}

/**
 * Combined create/edit hook for the Content Workspace — mirrors the old `useArticleForm`'s
 * `{ articleId }` optional-prop convention. In create mode only Basic Info + Writing apply, since
 * Versions/Translations/Publish need a real `contentId` to exist against.
 */
export function useContentWorkspace(contentId?: string) {
  const router = useRouter();
  const isEditing = !!contentId;
  const [activeTab, setActiveTab] = useState<ContentWorkspaceTab>("basicInfo");

  const contentTypes = useContentTypesQuery();
  const detail = useContentDetailQuery(contentId);

  const [activeVersionId, setActiveVersionId] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (detail.data && !activeVersionId) {
      setActiveVersionId(detail.data.currentVersionId ?? detail.data.versions[0]?.versionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail.data]);

  const version = useContentVersionQuery(contentId, activeVersionId);

  const [activeLanguage, setActiveLanguage] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!version.data) return;
    const stillPresent = version.data.localizations.some((localization) => localization.culture === activeLanguage);
    if (!stillPresent) setActiveLanguage(version.data.localizations[0]?.culture);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version.data]);

  const activeLocalization = version.data?.localizations.find((localization) => localization.culture === activeLanguage);
  const activeVersionSummary = detail.data?.versions.find((item) => item.versionId === activeVersionId);
  const isVersionEditable = activeVersionSummary ? EDITABLE_VERSION_STATUSES.has(activeVersionSummary.status) : true;

  const createForm = useAppForm(contentCreateFormSchema, {
    defaultValues: { contentTypeId: "", slug: "", language: "", title: "", summary: "", body: EMPTY_EDITORJS_DOCUMENT, visibility: "private" },
  });

  const draftForm = useAppForm(contentDraftFormSchema, {
    defaultValues: { language: "", title: "", summary: "", body: EMPTY_EDITORJS_DOCUMENT },
  });

  useEffect(() => {
    if (activeLocalization) {
      draftForm.reset({ language: activeLocalization.culture, title: activeLocalization.title, summary: activeLocalization.summary, body: activeLocalization.body });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLocalization?.culture, activeVersionId]);

  const translateForm = useAppForm(contentTranslateFormSchema, {
    defaultValues: { targetLanguage: "", title: "", summary: "", body: EMPTY_EDITORJS_DOCUMENT },
  });

  useEffect(() => {
    if (activeLocalization) {
      translateForm.reset({ targetLanguage: "", title: activeLocalization.title, summary: activeLocalization.summary, body: activeLocalization.body });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeVersionId]);

  const createMutation = useCreateContentMutation();
  const updateDraftMutation = useUpdateContentDraftMutation(contentId ?? "", activeVersionId ?? "");
  const createVersionMutation = useCreateContentVersionMutation(contentId ?? "");
  const publishMutation = usePublishContentMutation(contentId ?? "");
  const restoreVersionMutation = useRestoreContentVersionMutation(contentId ?? "");
  const translateMutation = useTranslateContentVersionMutation(contentId ?? "", activeVersionId ?? "");
  const deleteMutation = useDeleteContentMutation();
  const restoreContentMutation = useRestoreContentMutation();

  const onCreateSubmit = async (values: ContentCreateFormValues) => {
    const result = await createMutation.mutateAsync(values);
    router.push(`/content/articles/${result.contentId}`);
  };

  const onSaveDraft = async (values: ContentDraftFormValues) => {
    if (!contentId || !activeVersionId) return;
    await updateDraftMutation.mutateAsync(values);
  };

  const onPublish = async () => {
    if (!activeVersionId) return;
    await publishMutation.mutateAsync(activeVersionId);
  };

  const onCreateNewDraftVersion = async () => {
    if (!activeLocalization) return;
    const result = await createVersionMutation.mutateAsync({
      language: activeLocalization.culture,
      title: activeLocalization.title,
      summary: activeLocalization.summary,
      body: activeLocalization.body,
    });
    setActiveVersionId(result.versionId);
    setActiveTab("writing");
  };

  const onSelectVersion = (versionId: string) => {
    setActiveVersionId(versionId);
    setActiveLanguage(undefined);
    setActiveTab("writing");
  };

  const onRestoreVersion = async (versionId: string) => {
    const result = await restoreVersionMutation.mutateAsync(versionId);
    setActiveVersionId(result.versionId);
    setActiveLanguage(undefined);
    setActiveTab("writing");
  };

  const onTranslate = async (values: ContentTranslateFormValues) => {
    await translateMutation.mutateAsync(values);
    setActiveLanguage(values.targetLanguage);
    setActiveTab("writing");
  };

  const onDelete = async () => {
    if (!contentId) return;
    await deleteMutation.mutateAsync(contentId);
    router.push("/content/articles");
  };

  const onRestoreContent = async () => {
    if (!contentId) return;
    await restoreContentMutation.mutateAsync(contentId);
  };

  return {
    isEditing,
    activeTab,
    setActiveTab,
    contentTypes: contentTypes.data ?? [],
    detail: detail.data,
    isLoadingDetail: isEditing && detail.isLoading,
    version: version.data,
    isLoadingVersion: isEditing && version.isLoading,
    activeVersionId,
    activeVersionSummary,
    isVersionEditable,
    activeLanguage,
    setActiveLanguage,
    activeLocalization,
    createForm,
    draftForm,
    translateForm,
    onCreateSubmit,
    onSaveDraft,
    onPublish,
    onCreateNewDraftVersion,
    onSelectVersion,
    onRestoreVersion,
    onTranslate,
    onDelete,
    onRestoreContent,
    isCreating: createMutation.isPending,
    isSavingDraft: updateDraftMutation.isPending,
    isPublishing: publishMutation.isPending,
    isCreatingVersion: createVersionMutation.isPending,
    isRestoringVersion: restoreVersionMutation.isPending,
    isTranslating: translateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isRestoringContent: restoreContentMutation.isPending,
    createError: errorMessageOf(createMutation.error),
    draftError: errorMessageOf(updateDraftMutation.error),
    translateError: errorMessageOf(translateMutation.error),
    publishError: errorMessageOf(publishMutation.error),
  };
}
