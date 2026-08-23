import type { ApiResponse, CriteriaRequest, CursorPaginatedResult } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/content/_base";
import {
  mapContentDetail,
  mapContentSummary,
  mapContentVersionDetail,
  mapLandingContentItem,
  mapPublishedContent,
  serializeEditorJsBody,
  type RawContentDetail,
  type RawContentSummary,
  type RawContentVersionDetail,
  type RawLandingContentItem,
  type RawPublishedContent,
} from "@/services/content/content.mappers";
import type {
  ContentDetail,
  ContentSummary,
  ContentVersionDetail,
  CreateContentInput,
  CreateContentResult,
  CreateContentVersionInput,
  CreateContentVersionResult,
  DeleteContentResult,
  LandingContentItem,
  PublishContentResult,
  PublishedContent,
  RestoreContentResult,
  RestoreContentVersionResult,
  TranslateContentVersionInput,
  TranslateContentVersionResult,
  UpdateContentDraftInput,
  UpdateContentDraftResult,
} from "@/services/content/content.types";

/**
 * Real Content Service adapter (`core-backend/src/Services/Content`) — built against a direct
 * source audit of `Content.API/Endpoints/**`, not the originally-assumed contract (see the
 * 2026-08-23 backend audit in `.wolf/memory.md`/STATUS.md for the full endpoint/gap inventory).
 * Deliberately thin: only wraps what Content.API actually exposes. Notable deviations from the
 * originally-assumed shape, all backend realities (not frontend oversights):
 *
 * - No GET/list endpoint for content types (only `POST /content-types` to create one) — see
 *   `content-type.service.ts`'s doc comment for how a content-type picker is populated anyway.
 * - Admin search's cursor pagination is via query-string `cursor`/`limit`/`language`, not the
 *   `CriteriaRequest` body's `page`/`pageSize` (those two fields are accepted but silently ignored
 *   server-side — see `SearchContentsAdmin.cs`).
 * - "Cursor points" (pre-fetched jump-to-page cursors) exist only for the public Landing feed
 *   (`GET /contents/landing/cursor-points`) — there is no equivalent for Admin search. Admin
 *   pagination in this app is therefore forward-only ("Load more"), not numbered pages.
 * - There is no dedicated "list versions" endpoint — version history (without bodies) comes back
 *   embedded in `getById`; fetch a specific version's body via `getVersion`.
 * - `Body` is a JSON-encoded string on the wire, not a nested object — every method here
 *   serializes/parses it at the boundary (`content.mappers.ts`), so callers work with a real
 *   `EditorJsDocument` object throughout.
 * - No per-route permission checks exist for Content today (`.RequireAuthorization()` only, no
 *   `.RequirePermissions(...)`) — any authenticated user can call every non-anonymous endpoint.
 */
export const contentService = {
  /** `POST /contents` — 201. Creates the Content item together with its required first draft version. */
  async create(input: CreateContentInput): Promise<CreateContentResult> {
    const response = await httpClient.post<ApiResponse<CreateContentResult>>(`${BASE_PATH}/contents`, {
      contentTypeId: input.contentTypeId,
      slug: input.slug,
      language: input.language,
      title: input.title,
      summary: input.summary,
      body: serializeEditorJsBody(input.body),
      visibility: mapVisibilityToOrdinal(input.visibility),
    });
    return unwrapApiResponse(response);
  },

  /** `POST /contents/{contentId}/versions` — 201. Creates a new draft version, leaving any published version untouched. */
  async createVersion(contentId: string, input: CreateContentVersionInput): Promise<CreateContentVersionResult> {
    const response = await httpClient.post<ApiResponse<CreateContentVersionResult>>(`${BASE_PATH}/contents/${contentId}/versions`, {
      language: input.language,
      title: input.title,
      summary: input.summary,
      body: serializeEditorJsBody(input.body),
    });
    return unwrapApiResponse(response);
  },

  /** `GET /contents/{contentId}` — full version history (without bodies) + top-level status/visibility/publish state. */
  async getById(contentId: string): Promise<ContentDetail> {
    const response = await httpClient.get<ApiResponse<RawContentDetail>>(`${BASE_PATH}/contents/${contentId}`);
    return mapContentDetail(unwrapApiResponse(response));
  },

  /** `GET /contents/{contentId}/versions/{versionId}` — every language the version carries, including the Editor.js body. */
  async getVersion(contentId: string, versionId: string): Promise<ContentVersionDetail> {
    const response = await httpClient.get<ApiResponse<RawContentVersionDetail>>(`${BASE_PATH}/contents/${contentId}/versions/${versionId}`);
    return mapContentVersionDetail(unwrapApiResponse(response));
  },

  /** `PUT /contents/{contentId}/versions/{versionId}/draft` — updates one language's content on a draft (non-published, non-archived) version. */
  async updateDraft(contentId: string, versionId: string, input: UpdateContentDraftInput): Promise<UpdateContentDraftResult> {
    const response = await httpClient.put<ApiResponse<UpdateContentDraftResult>>(`${BASE_PATH}/contents/${contentId}/versions/${versionId}/draft`, {
      language: input.language,
      title: input.title,
      summary: input.summary,
      body: serializeEditorJsBody(input.body),
    });
    return unwrapApiResponse(response);
  },

  /** `POST /contents/{contentId}/versions/{versionId}/translations` — adds (or updates) a target language on an existing version via the same upsert mechanism draft editing uses. */
  async translateVersion(contentId: string, versionId: string, input: TranslateContentVersionInput): Promise<TranslateContentVersionResult> {
    const response = await httpClient.post<ApiResponse<TranslateContentVersionResult>>(`${BASE_PATH}/contents/${contentId}/versions/${versionId}/translations`, {
      targetLanguage: input.targetLanguage,
      title: input.title,
      summary: input.summary,
      body: serializeEditorJsBody(input.body),
    });
    return unwrapApiResponse(response);
  },

  /** `POST /contents/{contentId}/versions/{versionId}/restore` — restores a prior version's full language set into a brand-new current version. Never overwrites history. */
  async restoreVersion(contentId: string, versionId: string): Promise<RestoreContentVersionResult> {
    const response = await httpClient.post<ApiResponse<RestoreContentVersionResult>>(`${BASE_PATH}/contents/${contentId}/versions/${versionId}/restore`);
    return unwrapApiResponse(response);
  },

  /** `POST /contents/{contentId}/publish` — publishes a specific version. Never touches the current draft. */
  async publish(contentId: string, versionId: string): Promise<PublishContentResult> {
    const response = await httpClient.post<ApiResponse<PublishContentResult>>(`${BASE_PATH}/contents/${contentId}/publish`, { versionId });
    return unwrapApiResponse(response);
  },

  /** `POST /contents/{contentId}/restore` — undeletes a soft-deleted Content item (no-op / 404 once the 7-day hard-delete job has run). */
  async restoreContent(contentId: string): Promise<RestoreContentResult> {
    const response = await httpClient.post<ApiResponse<RestoreContentResult>>(`${BASE_PATH}/contents/${contentId}/restore`);
    return unwrapApiResponse(response);
  },

  /** `DELETE /contents/{contentId}` — soft-delete. Identity/versions/localizations are kept intact for `restoreContent` until the retention job runs. */
  async deleteContent(contentId: string): Promise<DeleteContentResult> {
    const response = await httpClient.delete<ApiResponse<DeleteContentResult>>(`${BASE_PATH}/contents/${contentId}`);
    return unwrapApiResponse(response);
  },

  /**
   * `POST /contents/admin/search` — admin/WCM list. `criteria.page`/`criteria.pageSize` are
   * accepted by the shared `CriteriaRequest` shape but ignored server-side; real pagination is the
   * `cursor`/`limit` query params. Never returns the Editor.js body.
   */
  async searchAdmin(params: { criteria: CriteriaRequest; cursor?: string | null; limit: number; language?: string }): Promise<CursorPaginatedResult<ContentSummary>> {
    const response = await httpClient.post<ApiResponse<CursorPaginatedResult<RawContentSummary>>>(`${BASE_PATH}/contents/admin/search`, params.criteria, {
      query: { cursor: params.cursor ?? undefined, limit: params.limit, language: params.language },
    });
    const page = unwrapApiResponse(response);
    return { items: page.items.map(mapContentSummary), nextCursor: page.nextCursor, hasMore: page.hasMore };
  },

  /** `GET /contents/landing` — public, published-only, cursor-paginated feed, resolved to one language. `AllowAnonymous` on the service; see this module's `_base.ts`/env note if the gateway's blanket `RequireAuth` needs a route-level exception for this to actually reach unauthenticated clients. */
  async getLanding(params: { contentTypeId?: string; language?: string; cursor?: string | null; limit: number }): Promise<CursorPaginatedResult<LandingContentItem>> {
    const response = await httpClient.get<ApiResponse<CursorPaginatedResult<RawLandingContentItem>>>(`${BASE_PATH}/contents/landing`, {
      query: { contentTypeId: params.contentTypeId, language: params.language, cursor: params.cursor ?? undefined, limit: params.limit },
    });
    const page = unwrapApiResponse(response);
    return { items: page.items.map(mapLandingContentItem), nextCursor: page.nextCursor, hasMore: page.hasMore };
  },

  /** `GET /contents/landing/cursor-points` — pre-fetched jump-to-page cursors for the Landing feed only (approximate under concurrent writes, per the endpoint's own doc comment). No Admin-search equivalent exists. */
  async getLandingCursorPoints(params: { contentTypeId?: string; language?: string; pageSize: number; pageCount: number }): Promise<{ pageSize: number; cursorPoints: string[] }> {
    const response = await httpClient.get<ApiResponse<{ pageSize: number; cursorPoints: string[] }>>(`${BASE_PATH}/contents/landing/cursor-points`, {
      query: { contentTypeId: params.contentTypeId, language: params.language, pageSize: params.pageSize, pageCount: params.pageCount },
    });
    return unwrapApiResponse(response);
  },

  /** `GET /contents/published/{slug}` — the public reader's single-item read. `AllowAnonymous` on the service (see the gateway note above). */
  async getPublishedBySlug(slug: string, language?: string): Promise<PublishedContent> {
    const response = await httpClient.get<ApiResponse<RawPublishedContent>>(`${BASE_PATH}/contents/published/${encodeURIComponent(slug)}`, { query: { language } });
    return mapPublishedContent(unwrapApiResponse(response));
  },
};

function mapVisibilityToOrdinal(visibility: CreateContentInput["visibility"]): number | undefined {
  if (!visibility) return undefined;
  const table: Record<NonNullable<CreateContentInput["visibility"]>, number> = {
    public: 1,
    authenticated: 2,
    internal: 3,
    restricted: 4,
    private: 5,
  };
  return table[visibility];
}
