import type { CriteriaRequest, PaginatedResult } from "@novacore/frontend-foundation";
import type { SubjectDetail, SubjectOption, SubjectSearchProvider } from "@novacore/frontend-next-shadcn";

import {
  permissionAssignmentStore,
  positionCollection,
  roleAssignmentStore,
  roleCollection,
  subjectCollection,
  type MockSubject,
} from "@/services/access-control";

/**
 * Resolves `SubjectOption`'s optional display-only summary fields (`roleNames`/
 * `totalPermissionCount`/`directPermissionCount`/`rolePermissionCount`) from the **same** mock
 * stores `access-control.service.ts` already reads (`permissionAssignmentStore`/
 * `roleAssignmentStore`/`roleCollection`) — so the numbers shown in `UserPermissionAssignment`'s
 * list/quick-review match exactly what the rest of the page (Roles/Direct Permissions tabs) shows
 * for the same user, rather than being fabricated separately. `rolePermissionCount` sums each
 * assigned role's own permission count without de-duplicating overlaps with other roles or with
 * direct grants — a display count, not a set size, per `SubjectOption.rolePermissionCount`'s doc
 * comment; `totalPermissionCount` is `direct + fromRoles` on that same basis.
 */
async function toSubjectOption(row: MockSubject): Promise<SubjectOption> {
  const directPermissionIds = permissionAssignmentStore.peek("user", row.id);
  const roleIds = await roleAssignmentStore.get("user", row.id);

  const roleNames: string[] = [];
  let rolePermissionCount = 0;
  for (const roleId of roleIds) {
    try {
      const role = await roleCollection.get(roleId);
      roleNames.push(role.name);
    } catch {
      // Role was deleted after being assigned — skip its name, its permissions no longer count.
      continue;
    }
    rolePermissionCount += permissionAssignmentStore.peek("role", roleId).length;
  }

  return {
    id: row.id,
    displayName: row.name,
    secondaryText: row.email,
    roleNames,
    directPermissionCount: directPermissionIds.length,
    rolePermissionCount,
    totalPermissionCount: directPermissionIds.length + rolePermissionCount,
  };
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
    const items = await Promise.all(page.items.map(toSubjectOption));
    return { ...page, items };
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
      ...(await toSubjectOption(row)),
      fields: [
        { label: "Email", value: row.email },
        { label: "Status", value: row.status === "active" ? "Active" : "Inactive" },
        { label: "Position", value: positionName ?? "—" },
      ],
    };
  },
};
