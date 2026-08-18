import type { CriteriaRequest, PaginatedResult } from "@novacore/frontend-foundation";
import type { SubjectDetail, SubjectOption, SubjectSearchProvider } from "@novacore/frontend-next-shadcn";

import { positionCollection, subjectCollection, type MockSubject } from "@/services/access-control";

function toSubjectOption(row: MockSubject): SubjectOption {
  return { id: row.id, displayName: row.name, secondaryText: row.email };
}

/**
 * WCM's `SubjectSearchProvider` adapter for `UserPermissionAssignment`/`UserAuthorizationDetail`
 * — the shared component's generic user/member search contract. Backed by the same mock
 * collection pattern as every other WCM service (no real WCM user/member search endpoint exists
 * yet — see docs/plan.md's External blockers); the adapter already speaks the real
 * `CriteriaRequest`/`PaginatedResult` contract a `POST /users/search`-style endpoint would use,
 * so swapping this for an `httpClient` call is the entire future migration.
 */
export const wcmSubjectSearchProvider: SubjectSearchProvider = {
  async search(request: CriteriaRequest): Promise<PaginatedResult<SubjectOption>> {
    const page = await subjectCollection.list(request);
    return { ...page, items: page.items.map(toSubjectOption) };
  },
  async getById(id: string): Promise<SubjectDetail | null> {
    let row: MockSubject;
    try {
      row = await subjectCollection.get(id);
    } catch {
      return null;
    }

    let positionName: string | null = null;
    if (row.positionId) {
      try {
        const position = await positionCollection.get(row.positionId);
        positionName = position.name;
      } catch {
        positionName = null;
      }
    }

    return {
      ...toSubjectOption(row),
      fields: [
        { label: "Email", value: row.email },
        { label: "Status", value: row.status === "active" ? "Active" : "Inactive" },
        { label: "Position", value: positionName ?? "—" },
      ],
    };
  },
};
