import type { AccessControlSubjectType } from "@novacore/frontend-next-shadcn";

import { simulateLatency } from "@/shared/lib/mock/simulateLatency";

function key(subjectType: AccessControlSubjectType, subjectId: string): string {
  return `${subjectType}:${subjectId}`;
}

export interface MockAuditLogEntry {
  id: string;
  subjectType: AccessControlSubjectType;
  subjectId: string;
  changeTime: string;
  actorName: string | null;
  grantedPermissionIds: string[];
  revokedPermissionIds: string[];
  grantedRoleIds: string[];
  revokedRoleIds: string[];
}

/**
 * Raw change-history rows, keyed by subject like every other mock store here. Deliberately stores
 * only ids (permission keys, role ids) — resolving those to display names needs the app's
 * permission catalog/i18n, which belongs in `features/access-control/api/access-control.service.ts`
 * (the adapter layer), not here (`services/` must not depend on `features/`, matching every other
 * `services/*.mock.ts` in this app).
 */
const entriesBySubject = new Map<string, MockAuditLogEntry[]>([
  [
    key("user", "subj-002"),
    [
      {
        id: "audit-seed-1",
        subjectType: "user",
        subjectId: "subj-002",
        changeTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        actorName: null,
        grantedPermissionIds: ["content:view", "content:manage"],
        revokedPermissionIds: [],
        grantedRoleIds: [],
        revokedRoleIds: [],
      },
    ],
  ],
  [
    key("role", "role-admin"),
    [
      {
        id: "audit-seed-2",
        subjectType: "role",
        subjectId: "role-admin",
        changeTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        actorName: null,
        grantedPermissionIds: [
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
        revokedPermissionIds: [],
        grantedRoleIds: [],
        revokedRoleIds: [],
      },
    ],
  ],
]);

let seq = 0;

export const auditLogStore = {
  async list(
    subjectType: AccessControlSubjectType,
    subjectId: string,
    page: number,
    pageSize: number,
  ): Promise<{ items: MockAuditLogEntry[]; totalCount: number }> {
    await simulateLatency(undefined, 80, 200);
    const all = [...(entriesBySubject.get(key(subjectType, subjectId)) ?? [])].sort(
      (a, b) => new Date(b.changeTime).getTime() - new Date(a.changeTime).getTime(),
    );
    const start = (page - 1) * pageSize;
    return { items: all.slice(start, start + pageSize), totalCount: all.length };
  },

  async getById(subjectType: AccessControlSubjectType, subjectId: string, entryId: string): Promise<MockAuditLogEntry | null> {
    await simulateLatency(undefined, 60, 160);
    return (entriesBySubject.get(key(subjectType, subjectId)) ?? []).find((entry) => entry.id === entryId) ?? null;
  },

  /** Appends one change record — called by the access-control adapter right after a real grant/revoke mutation succeeds. A no-op call (nothing granted or revoked) is never recorded. */
  record(input: Omit<MockAuditLogEntry, "id" | "changeTime">): void {
    if (
      input.grantedPermissionIds.length === 0 &&
      input.revokedPermissionIds.length === 0 &&
      input.grantedRoleIds.length === 0 &&
      input.revokedRoleIds.length === 0
    ) {
      return;
    }
    const mapKey = key(input.subjectType, input.subjectId);
    const entry: MockAuditLogEntry = { ...input, id: `audit-${++seq}-${Date.now()}`, changeTime: new Date().toISOString() };
    entriesBySubject.set(mapKey, [...(entriesBySubject.get(mapKey) ?? []), entry]);
  },
};
