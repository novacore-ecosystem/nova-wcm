import type { ApiResponse } from "@novacore/frontend-foundation";

import { httpClient, unwrapApiResponse } from "@/shared/lib/api/client";
import { BASE_PATH } from "@/services/content/_base";
import { contentService } from "@/services/content/content.service";
import type { ContentTypeOption } from "@/services/content/content.types";

/**
 * Content Service has **no GET/list endpoint for content types** — only `POST /content-types` to
 * create one (confirmed by reading every file under `Content.API/Endpoints/ContentTypes/`, which
 * contains exactly one endpoint). A create-content form still needs a way to offer "Article / News
 * / Blog" as choices, so this resolves the known set indirectly: content types are DB-seeded rows
 * with server-generated (non-deterministic) ids, so they can't be hardcoded — instead this reads
 * the distinct `(contentTypeId, contentTypeName)` pairs actually present across existing content
 * via Admin Search, which the seed data guarantees is non-empty for every seeded type.
 *
 * Known limitation, explicitly not worked around further: a content type with zero content items
 * (e.g. one just created via `createContentType`, before anything is authored against it) won't
 * appear here until something exists in it. The real fix is a `GET /content-types` endpoint on the
 * backend — flagged in this task's final report, not papered over with a second workaround.
 */
export const contentTypeService = {
  async listKnownContentTypes(): Promise<ContentTypeOption[]> {
    const page = await contentService.searchAdmin({ criteria: { sorts: [{ field: "createdAt", direction: "desc" }] }, limit: 100 });
    const byId = new Map<string, string>();
    for (const item of page.items) byId.set(item.contentTypeId, item.contentTypeName);
    return Array.from(byId, ([id, name]) => ({ id, name }));
  },

  /** `POST /content-types` — 201. Not surfaced in the UI (no "manage content types" screen was in scope), kept for API-surface completeness. */
  async create(input: { key: string; name: string; description: string }): Promise<{ contentTypeId: string }> {
    const response = await httpClient.post<ApiResponse<{ contentTypeId: string }>>(`${BASE_PATH}/content-types`, input);
    return unwrapApiResponse(response);
  },
};
