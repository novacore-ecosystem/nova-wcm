import { Permissions } from "@novacore/frontend-foundation";
import type { AccessControlSubjectType } from "@novacore/frontend-next-shadcn";

import { simulateLatency } from "@/shared/lib/mock/simulateLatency";

function key(subjectType: AccessControlSubjectType, subjectId: string): string {
  return `${subjectType}:${subjectId}`;
}

/**
 * Seeded to line up with the role/position ids in `role.mock.ts`/`position.mock.ts` — kept here
 * rather than in those files to avoid a circular import (both would need this store).
 */
const assignments = new Map<string, string[]>([
  [key("role", "role-admin"), [Permissions.Root]],
  [key("role", "role-content-editor"), [Permissions.Notification.View, Permissions.Notification.Manage, Permissions.Audit.View]],
  [key("role", "role-catalog-manager"), [Permissions.Product.Manage, Permissions.Product.Reindex, Permissions.Inventory.View]],
  [key("role", "role-viewer"), [Permissions.Audit.View, Permissions.Order.View]],
  [key("position", "pos-giam-doc"), [Permissions.Root]],
  [key("position", "pos-truong-phong-noi-dung"), [Permissions.Notification.Manage, Permissions.Audit.View]],
  [key("position", "pos-truong-phong-kinh-doanh"), [Permissions.Order.Manage, Permissions.Product.Manage]],
  [key("position", "pos-bien-tap-vien"), [Permissions.Notification.View]],
  [key("position", "pos-nhan-vien-ban-hang"), [Permissions.Order.View]],
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
