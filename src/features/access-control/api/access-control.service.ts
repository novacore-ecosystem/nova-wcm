import type { CriteriaRequest, PaginatedResult } from "@novacore/frontend-foundation";
import {
  buildPositionTree,
  type AccessControlServices,
  type AssignedPermissions,
  type PermissionGroup,
  type PermissionRecord,
  type PositionInput,
  type PositionRecord,
  type PositionTreeNode,
  type RoleInput,
  type RoleRecord,
} from "@novacore/frontend-next-shadcn";

import {
  permissionAssignmentStore,
  permissionCatalog,
  positionCollection,
  roleCollection,
  type MockPermissionRecord,
  type MockPosition,
  type MockRole,
} from "@/services/access-control";

function toPermissionRecord(row: MockPermissionRecord): PermissionRecord {
  return { id: row.id, category: row.category, displayName: row.displayName, description: row.description };
}

async function toRoleRecord(row: MockRole): Promise<RoleRecord> {
  const permissionIds = await permissionAssignmentStore.get("role", row.id);
  return { id: row.id, name: row.name, description: row.description, permissionCount: permissionIds.length };
}

function toPositionRecord(row: MockPosition): PositionRecord {
  return { id: row.id, name: row.name, code: row.code, description: row.description, parentId: row.parentId };
}

const permissions: AccessControlServices["permissions"] = {
  async getGroups(): Promise<PermissionGroup[]> {
    const rows = await permissionCatalog.list();
    const byCategory = new Map<string, PermissionRecord[]>();
    for (const row of rows) {
      const record = toPermissionRecord(row);
      const bucket = byCategory.get(record.category);
      if (bucket) bucket.push(record);
      else byCategory.set(record.category, [record]);
    }
    return [...byCategory.entries()]
      .map(([category, records]) => ({
        category,
        categoryLabel: category.charAt(0).toUpperCase() + category.slice(1),
        permissions: records.sort((a, b) => a.id.localeCompare(b.id)),
      }))
      .sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel));
  },
  async getById(id) {
    const row = await permissionCatalog.get(id);
    return row ? toPermissionRecord(row) : null;
  },
  async updateTranslations(id, translations) {
    const latest = translations[translations.length - 1];
    if (!latest) {
      const current = await permissionCatalog.get(id);
      if (!current) throw new Error(`Permission "${id}" was not found.`);
      return toPermissionRecord(current);
    }
    const updated = await permissionCatalog.updateDisplayCopy(id, {
      displayName: latest.displayName,
      description: latest.description,
    });
    return toPermissionRecord(updated);
  },
};

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
  },
};

const assignments: AccessControlServices["assignments"] = {
  async getAssignedPermissions(subjectType, subjectId): Promise<AssignedPermissions> {
    const permissionIds = await permissionAssignmentStore.get(subjectType, subjectId);
    return { permissionIds };
  },
  async assignPermissions(subjectType, subjectId, permissionIds) {
    await permissionAssignmentStore.set(subjectType, subjectId, permissionIds);
  },
};

/**
 * The WCM-specific `AccessControlServices` adapter — the only integration code the shared
 * Access Control module requires (see @novacore/frontend-next-shadcn/docs/access-control.md).
 * Backed by mock collections today, same as every other WCM feature (no WCM backend exists
 * yet); swapping these four objects' bodies for real `httpClient` calls is the entire future
 * migration, with zero changes required in the shared UI.
 */
export const accessControlServices: AccessControlServices = { permissions, roles, positions, assignments };
