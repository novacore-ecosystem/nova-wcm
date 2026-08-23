"use client";

import { Badge, Button } from "@novacore/frontend-next-shadcn";

import { useAppTranslation } from "@/shared/i18n";
import type { useContentWorkspace } from "@/features/content/components/ContentWorkspace/useContentWorkspace";

const STATUS_TONE: Record<string, "success" | "warning" | "secondary"> = {
  published: "success",
  draft: "secondary",
  inReview: "warning",
  approved: "warning",
  scheduled: "warning",
  unpublished: "secondary",
  archived: "secondary",
  rejected: "warning",
};

export function VersionsTab({ workspace }: { workspace: ReturnType<typeof useContentWorkspace> }) {
  const { t } = useAppTranslation();
  const { detail, activeVersionId, isVersionEditable, onSelectVersion, onPublish, onCreateNewDraftVersion, onRestoreVersion, isPublishing, isCreatingVersion, isRestoringVersion, publishError } =
    workspace;

  if (!detail) return null;

  return (
    <div className="flex flex-col gap-4">
      {!isVersionEditable ? (
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <p className="text-sm text-muted-foreground">{t("content.currentVersionNotEditable", "The current version isn't editable anymore. Start a new draft to keep writing.")}</p>
          <Button size="sm" variant="outline" loading={isCreatingVersion} onClick={() => void onCreateNewDraftVersion()}>
            {t("content.newDraftVersion", "New draft version")}
          </Button>
        </div>
      ) : null}

      {publishError ? (
        <p role="alert" className="text-sm text-destructive">
          {publishError}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        {detail.versions
          .slice()
          .sort((a, b) => b.versionNumber - a.versionNumber)
          .map((item) => {
            const isActive = item.versionId === activeVersionId;
            const isPublished = detail.publishedVersionId === item.versionId;
            const titles = item.localizations.map((localization) => `${localization.title} (${localization.culture})`).join(", ") || t("content.untitled", "Untitled");

            return (
              <div key={item.versionId} className={`flex items-center justify-between rounded-md border p-3 ${isActive ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {t("content.version", "Version")} {item.versionNumber}
                    </span>
                    <Badge variant={STATUS_TONE[item.status] ?? "neutral"} className="capitalize">
                      {item.status}
                    </Badge>
                    {isPublished ? <Badge variant="success">{t("content.currentlyPublished", "Currently published")}</Badge> : null}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{titles}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => onSelectVersion(item.versionId)}>
                    {t("content.view", "View")}
                  </Button>
                  {!isPublished ? (
                    <Button size="sm" loading={isActive && isPublishing} onClick={() => void onPublish()} disabled={!isActive}>
                      {t("content.publish", "Publish")}
                    </Button>
                  ) : null}
                  <Button size="sm" variant="ghost" loading={isRestoringVersion} onClick={() => void onRestoreVersion(item.versionId)}>
                    {t("content.restore", "Restore")}
                  </Button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
