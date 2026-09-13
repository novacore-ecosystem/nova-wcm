import type { CriteriaRequest, PaginatedResult } from "@novacore/frontend-foundation";
import {
  buildPositionTree,
  type AccessControlServices,
  type AssignedPermissions,
  type AuditLogChangeItem,
  type PositionInput,
  type PositionRecord,
  type PositionTreeNode,
  type RoleInput,
  type RoleRecord,
} from "@novacore/frontend-next-shadcn";

import {
  auditLogStore,
  permissionAssignmentStore,
  positionCollection,
  roleAssignmentStore,
  roleCollection,
  type MockPosition,
  type MockRole,
} from "@/services/access-control";

/** Mock-only display-name resolution for a permission key ("content:manage" -> "Content Manage") — a real backend would just return an already-resolved name; the mock has no i18n access at this layer (see access-control.service.ts's module doc comment). */
function humanizePermissionKey(id: string): string {
  return id
    .split(/[:\-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function toAuditLogChangeItems(permissionIds: string[]): Promise<AuditLogChangeItem[]> {
  return permissionIds.map((id) => ({ id, displayName: humanizePermissionKey(id) }));
}

async function toAuditLogRoleItems(roleIds: string[]): Promise<AuditLogChangeItem[]> {
  return Promise.all(
    roleIds.map(async (id) => {
      try {
        const role = await roleCollection.get(id);
        return { id, displayName: role.name };
      } catch {
        return { id, displayName: id };
      }
    }),
  );
}

async function toRoleRecord(row: MockRole): Promise<RoleRecord> {
  const permissionIds = await permissionAssignmentStore.get("role", row.id);
  return { id: row.id, name: row.name, description: row.description, permissionCount: permissionIds.length };
}

function toPositionRecord(row: MockPosition): PositionRecord {
  return { id: row.id, name: row.name, code: row.code, description: row.description, parentId: row.parentId };
}

const roles: AccessControlServices["roles"] = {
  async getList(request: CriteriaRequest): Promise<PaginatedResult<RoleRecord>> {
    const page = await roleCollection.list(request);
    const items = await Promise.all(page.items.map(toRoleRecord));
    return { ...page, items };
  },
  async getById(id) {
    try {
      return await toRoleRecord(await roleCollection.get(id));
    } catch {
      return null;
    }
  },
  async create(input: RoleInput) {
    const row = await roleCollection.create({ id: `role-${Date.now()}`, name: input.name, description: input.description });
    return toRoleRecord(row);
  },
  async update(id, input: RoleInput) {
    const row = await roleCollection.update(id, { name: input.name, description: input.description });
    return toRoleRecord(row);
  },
  async delete(id) {
    await roleCollection.remove(id);
    permissionAssignmentStore.remove("role", id);
  },
};

const positions: AccessControlServices["positions"] = {
  async getList(request: CriteriaRequest): Promise<PaginatedResult<PositionRecord>> {
    const page = await positionCollection.list(request);
    return { ...page, items: page.items.map(toPositionRecord) };
  },
  async getTree(): Promise<PositionTreeNode[]> {
    const rows = await positionCollection.listAll();
    return buildPositionTree(rows.map(toPositionRecord));
  },
  async getById(id) {
    try {
      return toPositionRecord(await positionCollection.get(id));
    } catch {
      return null;
    }
  },
  async create(input: PositionInput) {
    const row = await positionCollection.create({
      id: `pos-${Date.now()}`,
      name: input.name,
      code: input.code,
      description: input.description,
      parentId: input.parentId,
    });
    return toPositionRecord(row);
  },
  async update(id, input: PositionInput) {
    const row = await positionCollection.update(id, {
      name: input.name,
      code: input.code,
      description: input.description,
      parentId: input.parentId,
    });
    return toPositionRecord(row);
  },
  async delete(id) {
    await positionCollection.remove(id);
    permissionAssignmentStore.remove("position", id);
    roleAssignmentStore.remove("position", id);
  },
};

const assignments: AccessControlServices["assignments"] = {
  async getAssignedPermissions(subjectType, subjectId): Promise<AssignedPermissions> {
    const permissionIds = await permissionAssignmentStore.get(subjectType, subjectId);
    return { permissionIds };
  },
  async assignPermissions(subjectType, subjectId, mutation) {
    await permissionAssignmentStore.mutate(subjectType, subjectId, mutation);
    auditLogStore.record({
      subjectType,
      subjectId,
      actorName: "Current user",
      grantedPermissionIds: mutation.grant,
      revokedPermissionIds: mutation.revoke,
      grantedRoleIds: [],
      revokedRoleIds: [],
    });
  },
};

const roleAssignments: AccessControlServices["roleAssignments"] = {
  async getAssignedRoleIds(subjectType, subjectId) {
    return roleAssignmentStore.get(subjectType, subjectId);
  },
  async assignRoles(subjectType, subjectId, mutation) {
    await roleAssignmentStore.mutate(subjectType, subjectId, mutation);
    auditLogStore.record({
      subjectType,
      subjectId,
      actorName: "Current user",
      grantedPermissionIds: [],
      revokedPermissionIds: [],
      grantedRoleIds: mutation.grant,
      revokedRoleIds: mutation.revoke,
    });
  },
};

const auditLogs: AccessControlServices["auditLogs"] = {
  async list(subjectType, subjectId, request: CriteriaRequest) {
    const page = request.page ?? 1;
    const pageSize = request.pageSize ?? 10;
    const { items, totalCount } = await auditLogStore.list(subjectType, subjectId, page, pageSize);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    return {
      items: items.map((entry) => ({
        id: entry.id,
        changeTime: entry.changeTime,
        actorName: entry.actorName,
        permissionGrantedCount: entry.grantedPermissionIds.length,
        permissionRevokedCount: entry.revokedPermissionIds.length,
        roleGrantedCount: entry.grantedRoleIds.length,
        roleRevokedCount: entry.revokedRoleIds.length,
      })),
      pageNumber: page,
      pageSize,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  },
  async getDetail(subjectType, subjectId, entryId) {
    const entry = await auditLogStore.getById(subjectType, subjectId, entryId);
    if (!entry) return null;
    const [grantedPermissions, revokedPermissions, grantedRoles, revokedRoles] = await Promise.all([
      toAuditLogChangeItems(entry.grantedPermissionIds),
      toAuditLogChangeItems(entry.revokedPermissionIds),
      toAuditLogRoleItems(entry.grantedRoleIds),
      toAuditLogRoleItems(entry.revokedRoleIds),
    ]);
    return {
      id: entry.id,
      changeTime: entry.changeTime,
      actorName: entry.actorName,
      grantedPermissions,
      revokedPermissions,
      grantedRoles,
      revokedRoles,
    };
  },
};

/**
 * The WCM-specific `AccessControlServices` adapter — the only integration code the shared
 * Access Control module requires beyond its `permissions` catalog prop (see
 * @novacore/frontend-next-shadcn/docs/access-control.md). Backed by mock collections today, same
 * as every other WCM feature (no WCM backend exists yet); swapping these objects' bodies for real
 * `httpClient` calls is the entire future migration, with zero changes required in the shared UI.
 *
 * `auditLogs` is mock-only in a different sense than the rest: there is no real backend contract
 * to eventually swap in yet at all (no audit-log service exists), so `humanizePermissionKey`
 * above is a deliberately simple stand-in for what a real backend would just return as an
 * already-resolved display name.
 */
export const accessControlServices: AccessControlServices = { roles, positions, assignments, roleAssignments, auditLogs };
