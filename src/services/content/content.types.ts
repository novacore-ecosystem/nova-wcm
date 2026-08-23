/**
 * Mirrors Content.Domain's enums verbatim (`Content.Domain/Enums/*.cs`). Numeric values match the
 * C# `byte` enum ordinals — none of these carry a `JsonStringEnumConverter`, so the wire format is
 * the raw number (see `content.mappers.ts`). These string unions are this app's own
 * display-friendly mapping, same convention as `support-chat.types.ts`.
 */
export type ContentStatus = "draft" | "inReview" | "approved" | "scheduled" | "published" | "unpublished" | "archived" | "rejected";
export type ContentVisibility = "public" | "authenticated" | "internal" | "restricted" | "private";

/**
 * An Editor.js `OutputData` document. Kept loose (not the full `@editorjs/editorjs` type, which
 * isn't exported in a form convenient to depend on outside the editor component) — every block's
 * `data` shape is tool-specific and this app only needs to round-trip it, never interpret it.
 */
export interface EditorJsBlock {
  id?: string;
  type: string;
  data: Record<string, unknown>;
}

export interface EditorJsDocument {
  time?: number;
  blocks: EditorJsBlock[];
  version?: string;
}

export const EMPTY_EDITORJS_DOCUMENT: EditorJsDocument = { blocks: [] };

/** A content type option (`article`/`news`/`blog` per the current seed data). No GET/list endpoint exists for these — see `content-type.service.ts`'s doc comment for how this app resolves them anyway. */
export interface ContentTypeOption {
  id: string;
  name: string;
}

/** `SearchContentsAdminItemResponse` verbatim — the admin list row shape. Never carries a body (see that endpoint's own doc comment: "Never returns the Editor.js body"). */
export interface ContentSummary {
  id: string;
  contentTypeId: string;
  contentTypeName: string;
  slug: string;
  status: ContentStatus;
  visibility: ContentVisibility;
  isDeleted: boolean;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

/** One language's metadata on a version, as embedded in `GetContentByIdResult` — no body (see `ContentDetail`'s doc comment). */
export interface ContentVersionLocalizationSummary {
  culture: string;
  title: string;
  summary: string;
}

export interface ContentVersionSummary {
  versionId: string;
  versionNumber: number;
  status: ContentStatus;
  localizations: ContentVersionLocalizationSummary[];
}

/**
 * `GetContentByIdResult` verbatim. Version history is embedded but never carries a body — fetch
 * `ContentVersionDetail` (via `getVersion`) for the one version/language being edited.
 */
export interface ContentDetail {
  contentId: string;
  contentTypeId: string;
  contentTypeName: string;
  slug: string;
  status: ContentStatus;
  visibility: ContentVisibility;
  isDeleted: boolean;
  currentVersionId?: string;
  publishedVersionId?: string;
  publishedAt?: string;
  versions: ContentVersionSummary[];
}

/** One language's full content on a version, including its Editor.js body — parsed from the wire's JSON-encoded string (see `content.mappers.ts`). */
export interface ContentVersionLocalization {
  culture: string;
  title: string;
  summary: string;
  body: EditorJsDocument;
  updatedAt: string;
}

/** `GetContentVersionResult` verbatim — "every language it carries, including the Editor.js JSON body" per the endpoint's own doc comment. */
export interface ContentVersionDetail {
  contentId: string;
  versionId: string;
  versionNumber: number;
  status: ContentStatus;
  localizations: ContentVersionLocalization[];
}

/** `GetPublishedContentBySlugResult` verbatim — the public reader's single-item shape, one language only (server-resolved). */
export interface PublishedContent {
  contentId: string;
  contentTypeId: string;
  slug: string;
  language: string;
  title: string;
  summary: string;
  body: EditorJsDocument;
  publishedAt: string;
}

/** `GetLandingContentsItemResponse` verbatim — public landing-feed list item, one language only (server-resolved). */
export interface LandingContentItem {
  id: string;
  contentTypeId: string;
  slug: string;
  language: string;
  title: string;
  summary: string;
  publishedAt: string;
}

export interface CreateContentInput {
  contentTypeId: string;
  slug: string;
  language?: string;
  title: string;
  summary: string;
  body: EditorJsDocument;
  visibility?: ContentVisibility;
}

export interface CreateContentVersionInput {
  language?: string;
  title: string;
  summary: string;
  body: EditorJsDocument;
}

export interface UpdateContentDraftInput {
  language?: string;
  title: string;
  summary: string;
  body: EditorJsDocument;
}

export interface TranslateContentVersionInput {
  targetLanguage: string;
  title: string;
  summary: string;
  body: EditorJsDocument;
}

export interface CreateContentResult {
  contentId: string;
  versionId: string;
}

export interface CreateContentVersionResult {
  contentId: string;
  versionId: string;
  versionNumber: number;
}

export interface UpdateContentDraftResult {
  contentId: string;
  versionId: string;
  language: string;
}

export interface TranslateContentVersionResult {
  contentId: string;
  versionId: string;
  targetLanguage: string;
  wasExistingLanguage: boolean;
}

export interface RestoreContentVersionResult {
  contentId: string;
  versionId: string;
  versionNumber: number;
}

export interface PublishContentResult {
  contentId: string;
  versionId: string;
  publishedAt: string;
}

export interface RestoreContentResult {
  contentId: string;
}

export interface DeleteContentResult {
  contentId: string;
  deletedAt: string;
}
