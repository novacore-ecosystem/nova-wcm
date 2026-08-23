import type {
  ContentDetail,
  ContentStatus,
  ContentSummary,
  ContentVersionDetail,
  ContentVersionLocalization,
  ContentVersionLocalizationSummary,
  ContentVersionSummary,
  ContentVisibility,
  EditorJsDocument,
  LandingContentItem,
  PublishedContent,
} from "@/services/content/content.types";
import { EMPTY_EDITORJS_DOCUMENT } from "@/services/content/content.types";

/**
 * Content.API returns Content.Domain's enums as their raw numeric ordinal — confirmed by reading
 * `Content.Domain/Enums/{ContentStatus,ContentVisibility}.cs`: neither carries a
 * `JsonStringEnumConverter`, so this follows ASP.NET Core minimal-API's default (unlike the shared
 * `CriteriaOperator`/`SortDirection` types, which *do* serialize as strings — the two conventions
 * coexist in the same request/response, don't assume uniformity). Property names arrive camelCase
 * (no `ConfigureHttpJsonOptions` override found anywhere in Content.API). Both confirmed by direct
 * backend source read, not assumed — if wrong, this file is the only place that needs fixing.
 */
const CONTENT_STATUS: Record<number, ContentStatus> = {
  1: "draft",
  2: "inReview",
  3: "approved",
  4: "scheduled",
  5: "published",
  6: "unpublished",
  7: "archived",
  8: "rejected",
};

const CONTENT_VISIBILITY: Record<number, ContentVisibility> = {
  1: "public",
  2: "authenticated",
  3: "internal",
  4: "restricted",
  5: "private",
};

function mapEnum<T>(table: Record<number, T>, raw: number, fallback: T): T {
  return table[raw] ?? fallback;
}

export function mapContentStatus(raw: number): ContentStatus {
  return mapEnum(CONTENT_STATUS, raw, "draft");
}

export function mapContentVisibility(raw: number): ContentVisibility {
  return mapEnum(CONTENT_VISIBILITY, raw, "private");
}

/**
 * `Body` is a plain `string` on the wire everywhere in the C# contract (`ContentLocalization.Body`
 * — persisted as Postgres `jsonb`, but the request/response DTOs carry it JSON-encoded, not as a
 * nested object). The backend only validates it parses as JSON (`JsonDocument.Parse`), never
 * deserializes it into a typed Editor.js model — so this is the one, deliberately permissive,
 * parse boundary. Malformed content (shouldn't happen given backend validation, but a defensive
 * fallback beats a crashed editor) becomes an empty document rather than throwing.
 */
export function parseEditorJsBody(raw: string): EditorJsDocument {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && Array.isArray((parsed as EditorJsDocument).blocks)) {
      return parsed as EditorJsDocument;
    }
    return EMPTY_EDITORJS_DOCUMENT;
  } catch {
    return EMPTY_EDITORJS_DOCUMENT;
  }
}

/** Inverse of {@link parseEditorJsBody} — every write endpoint (`CreateContent`/`CreateContentVersion`/`UpdateContentDraft`/`TranslateContentVersion`) takes `Body` as this JSON-encoded string. */
export function serializeEditorJsBody(document: EditorJsDocument): string {
  return JSON.stringify(document);
}

export interface RawContentSummary {
  id: string;
  contentTypeId: string;
  contentTypeName: string;
  slug: string;
  status: number;
  visibility: number;
  isDeleted: boolean;
  title?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function mapContentSummary(raw: RawContentSummary): ContentSummary {
  return {
    id: raw.id,
    contentTypeId: raw.contentTypeId,
    contentTypeName: raw.contentTypeName,
    slug: raw.slug,
    status: mapContentStatus(raw.status),
    visibility: mapContentVisibility(raw.visibility),
    isDeleted: raw.isDeleted,
    title: raw.title ?? undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export interface RawContentVersionLocalizationSummary {
  culture: string;
  title: string;
  summary: string;
}

function mapVersionLocalizationSummary(raw: RawContentVersionLocalizationSummary): ContentVersionLocalizationSummary {
  return { culture: raw.culture, title: raw.title, summary: raw.summary };
}

export interface RawContentVersionSummary {
  versionId: string;
  versionNumber: number;
  status: number;
  localizations: RawContentVersionLocalizationSummary[];
}

function mapVersionSummary(raw: RawContentVersionSummary): ContentVersionSummary {
  return {
    versionId: raw.versionId,
    versionNumber: raw.versionNumber,
    status: mapContentStatus(raw.status),
    localizations: raw.localizations.map(mapVersionLocalizationSummary),
  };
}

export interface RawContentDetail {
  contentId: string;
  contentTypeId: string;
  contentTypeName: string;
  slug: string;
  status: number;
  visibility: number;
  isDeleted: boolean;
  currentVersionId?: string | null;
  publishedVersionId?: string | null;
  publishedAt?: string | null;
  versions: RawContentVersionSummary[];
}

export function mapContentDetail(raw: RawContentDetail): ContentDetail {
  return {
    contentId: raw.contentId,
    contentTypeId: raw.contentTypeId,
    contentTypeName: raw.contentTypeName,
    slug: raw.slug,
    status: mapContentStatus(raw.status),
    visibility: mapContentVisibility(raw.visibility),
    isDeleted: raw.isDeleted,
    currentVersionId: raw.currentVersionId ?? undefined,
    publishedVersionId: raw.publishedVersionId ?? undefined,
    publishedAt: raw.publishedAt ?? undefined,
    versions: raw.versions.map(mapVersionSummary),
  };
}

export interface RawContentVersionLocalization {
  culture: string;
  title: string;
  summary: string;
  body: string;
  updatedAt: string;
}

function mapVersionLocalization(raw: RawContentVersionLocalization): ContentVersionLocalization {
  return {
    culture: raw.culture,
    title: raw.title,
    summary: raw.summary,
    body: parseEditorJsBody(raw.body),
    updatedAt: raw.updatedAt,
  };
}

export interface RawContentVersionDetail {
  contentId: string;
  versionId: string;
  versionNumber: number;
  status: number;
  localizations: RawContentVersionLocalization[];
}

export function mapContentVersionDetail(raw: RawContentVersionDetail): ContentVersionDetail {
  return {
    contentId: raw.contentId,
    versionId: raw.versionId,
    versionNumber: raw.versionNumber,
    status: mapContentStatus(raw.status),
    localizations: raw.localizations.map(mapVersionLocalization),
  };
}

export interface RawPublishedContent {
  contentId: string;
  contentTypeId: string;
  slug: string;
  language: string;
  title: string;
  summary: string;
  body: string;
  publishedAt: string;
}

export function mapPublishedContent(raw: RawPublishedContent): PublishedContent {
  return {
    contentId: raw.contentId,
    contentTypeId: raw.contentTypeId,
    slug: raw.slug,
    language: raw.language,
    title: raw.title,
    summary: raw.summary,
    body: parseEditorJsBody(raw.body),
    publishedAt: raw.publishedAt,
  };
}

export interface RawLandingContentItem {
  id: string;
  contentTypeId: string;
  slug: string;
  language: string;
  title: string;
  summary: string;
  publishedAt: string;
}

export function mapLandingContentItem(raw: RawLandingContentItem): LandingContentItem {
  return {
    id: raw.id,
    contentTypeId: raw.contentTypeId,
    slug: raw.slug,
    language: raw.language,
    title: raw.title,
    summary: raw.summary,
    publishedAt: raw.publishedAt,
  };
}
