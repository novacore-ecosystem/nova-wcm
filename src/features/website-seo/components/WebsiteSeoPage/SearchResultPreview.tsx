"use client";

import { useAppTranslation } from "@/shared/i18n";

/**
 * A small, honest mock of a Google search result — presentational only, not a generic
 * reusable "SEO panel" (see docs/plan.md §13: SEO preview is app-level, not promoted to
 * shared until a second app needs it). Deliberately kept to this one component.
 */
export function SearchResultPreview({ title, description, path = "/" }: { title: string; description: string; path?: string }) {
  const { t } = useAppTranslation();
  const displayTitle = title.trim() || t("websiteSeo.preview.titlePlaceholder", "Tiêu đề trang của bạn");
  const displayDescription =
    description.trim() || t("websiteSeo.preview.descriptionPlaceholder", "Mô tả trang của bạn sẽ hiển thị ở đây.");

  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t("websiteSeo.preview.label", "Xem trước trên Google")}
      </p>
      <div className="max-w-xl">
        <p className="truncate text-sm text-[#202124] dark:text-neutral-200">
          novahome.vn{path === "/" ? "" : path}
        </p>
        <p className="truncate text-xl text-[#1a0dab] dark:text-blue-400">{displayTitle}</p>
        <p className="line-clamp-2 text-sm text-[#4d5156] dark:text-neutral-400">{displayDescription}</p>
      </div>
    </div>
  );
}
