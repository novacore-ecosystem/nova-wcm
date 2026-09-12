import type { AccessControlSubjectType } from "@novacore/frontend-next-shadcn";

import { simulateLatency } from "@/shared/lib/mock/simulateLatency";

function key(subjectType: AccessControlSubjectType, subjectId: string): string {
  return `${subjectType}:${subjectId}`;
}

/**
 * Position/User → Role[] holdings. Ids match `position.mock.ts`/`subject.mock.ts`/`role.mock.ts`
 * — kept here rather than in those files for the same reason as `assignment.mock.ts`: avoids a
 * circular import between them, and `services/` stays the mock-backend layer (never depends on
 * `features/`).
 */
const roleAssignments = new Map<string, string[]>([
  [key("position", "pos-giam-doc"), ["role-admin"]],
  [key("position", "pos-truong-phong-noi-dung"), ["role-content-editor"]],
  [key("position", "pos-truong-phong-kinh-doanh"), ["role-catalog-manager"]],
  [key("position", "pos-bien-tap-vien"), ["role-content-editor"]],
  [key("position", "pos-nhan-vien-ban-hang"), ["role-viewer"]],
  [key("user", "subj-001"), ["role-admin"]],
  [key("user", "subj-002"), ["role-content-editor"]],
  [key("user", "subj-003"), ["role-catalog-manager"]],
  [key("user", "subj-007"), ["role-viewer"]],
]);

export const roleAssignmentStore = {
  async get(subjectType: AccessControlSubjectType, subjectId: string): Promise<string[]> {
    await simulateLatency(undefined, 80, 200);
    return [...(roleAssignments.get(key(subjectType, subjectId)) ?? [])];
  },
  /** Applies an explicit `{ grant, revoke }` delta — see `permissionAssignmentStore.mutate`'s doc comment; same contract, same rationale. */
  async mutate(
    subjectType: AccessControlSubjectType,
    subjectId: string,
    { grant, revoke }: { grant: string[]; revoke: string[] },
  ): Promise<void> {
    const mapKey = key(subjectType, subjectId);
    const current = new Set(roleAssignments.get(mapKey) ?? []);
    for (const id of revoke) current.delete(id);
    for (const id of grant) current.add(id);
    roleAssignments.set(mapKey, [...current]);
    await simulateLatency(undefined, 120, 280);
  },
  remove(subjectType: AccessControlSubjectType, subjectId: string): void {
    roleAssignments.delete(key(subjectType, subjectId));
  },
};
