import type { ContentStatus } from "@/services/content";

/** Shared Badge tone mapping for `ContentStatus`, used by the list page and the workspace's Versions tab. */
export const CONTENT_STATUS_TONE: Record<ContentStatus, "success" | "warning" | "secondary"> = {
  published: "success",
  draft: "secondary",
  inReview: "warning",
  approved: "warning",
  scheduled: "warning",
  unpublished: "secondary",
  archived: "secondary",
  rejected: "warning",
};
