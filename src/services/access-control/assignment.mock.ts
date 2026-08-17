import type { AccessControlSubjectType } from "@novacore/frontend-next-shadcn";

import { simulateLatency } from "@/shared/lib/mock/simulateLatency";

function key(subjectType: AccessControlSubjectType, subjectId: string): string {
  return `${subjectType}:${subjectId}`;
}

/**
 * Seeded to line up with the role/position ids in `role.mock.ts`/`position.mock.ts` — kept here
 * rather than in those files to avoid a circular import (both would need this store). Permission
 * ids are plain string literals, not imported from `features/access-control/wcm-permissions.ts`
 * — `services/` is the mock-backend layer and must not depend on `features/` (the adapter layer
 * that consumes it), matching every other `services/*.mock.ts` in this app. Keep these in sync
 * with `wcmPermissionDefinitions` by hand; there are only 16 ids.
 */
const assignments = new Map<string, string[]>([
  [
    key("role", "role-admin"),
    [
      "content:view",
      "content:manage",
      "catalog:view",
      "catalog:manage",
      "media:view",
      "media:manage",
      "website:view",
      "website:manage",
      "settings:view",
      "settings:manage",
      "permission:view",
      "permission:manage",
      "role:view",
      "role:manage",
      "position:view",
      "position:manage",
    ],
  ],
  [key("role", "role-content-editor"), ["content:view", "content:manage", "media:view", "media:manage"]],
  [key("role", "role-catalog-manager"), ["catalog:view", "catalog:manage"]],
  [key("role", "role-viewer"), ["content:view", "catalog:view", "media:view", "website:view", "settings:view"]],
  [
    key("position", "pos-giam-doc"),
    [
      "content:view",
      "content:manage",
      "catalog:view",
      "catalog:manage",
      "media:view",
      "media:manage",
      "website:view",
      "website:manage",
      "settings:view",
      "settings:manage",
      "permission:view",
      "permission:manage",
      "role:view",
      "role:manage",
      "position:view",
      "position:manage",
    ],
  ],
  [key("position", "pos-truong-phong-noi-dung"), ["content:view", "content:manage", "media:view", "media:manage", "role:view"]],
  [key("position", "pos-truong-phong-kinh-doanh"), ["catalog:view", "catalog:manage", "website:view"]],
  [key("position", "pos-bien-tap-vien"), ["content:view", "media:view"]],
  [key("position", "pos-nhan-vien-ban-hang"), ["catalog:view"]],
  // A couple of direct user grants, so User Permission Assignment's single-select path has
  // something pre-checked to demonstrate — ids match `subject.mock.ts`.
  [key("user", "subj-002"), ["content:view", "content:manage"]],
  [key("user", "subj-007"), ["catalog:view"]],
]);

export const permissionAssignmentStore = {
  async get(subjectType: AccessControlSubjectType, subjectId: string): Promise<string[]> {
    await simulateLatency(undefined, 80, 200);
    return [...(assignments.get(key(subjectType, subjectId)) ?? [])];
  },
  async set(subjectType: AccessControlSubjectType, subjectId: string, permissionIds: string[]): Promise<void> {
    assignments.set(key(subjectType, subjectId), [...permissionIds]);
    await simulateLatency(undefined, 120, 280);
  },
  /** Sync read used by role/position list mapping to compute `permissionCount` without an extra await per row. */
  peek(subjectType: AccessControlSubjectType, subjectId: string): string[] {
    return assignments.get(key(subjectType, subjectId)) ?? [];
  },
  remove(subjectType: AccessControlSubjectType, subjectId: string): void {
    assignments.delete(key(subjectType, subjectId));
  },
};
