import { PERMISSION_VALUES } from "@novacore/frontend-foundation";
import { derivePermissionCategory } from "@novacore/frontend-next-shadcn";

import { simulateLatency } from "@/shared/lib/mock/simulateLatency";

export interface MockPermissionRecord {
  id: string;
  category: string;
  displayName: string;
  description: string;
}

function capitalize(segment: string): string {
  return segment ? segment.charAt(0).toUpperCase() + segment.slice(1) : segment;
}

/**
 * Seeds display copy from the real platform catalog (`PERMISSION_VALUES`, mirrored from the
 * backend's `Permissions.cs`) — a real adapter would instead read `PermissionDefinitionTranslation`
 * rows. `updateTranslations` mutates this in place; there's no locale dimension because
 * `PermissionService.getGroups()`/`getById()` don't take one either (see docs/plan.md §15's
 * access-control notes) — a genuine gap in the shared contract, not a WCM omission.
 */
function seedPermission(id: string): MockPermissionRecord {
  const category = derivePermissionCategory(id);
  const leaf = id.length > category.length ? id.slice(category.length + 1) : id;
  const leafLabel = leaf.split("-").map(capitalize).join(" ") || capitalize(category);
  return {
    id,
    category,
    displayName: `${capitalize(category)} — ${leafLabel}`,
    description: `Grants ${leafLabel.toLowerCase()} access within the ${category} module.`,
  };
}

const rows = new Map<string, MockPermissionRecord>(PERMISSION_VALUES.map((id) => [id, seedPermission(id)]));

export const permissionCatalog = {
  async list(): Promise<MockPermissionRecord[]> {
    return simulateLatency([...rows.values()]);
  },
  async get(id: string): Promise<MockPermissionRecord | null> {
    await simulateLatency(undefined, 80, 200);
    return rows.get(id) ?? null;
  },
  async updateDisplayCopy(id: string, patch: { displayName: string; description?: string }): Promise<MockPermissionRecord> {
    const existing = rows.get(id);
    if (!existing) throw new Error(`Permission "${id}" was not found.`);
    const updated: MockPermissionRecord = { ...existing, displayName: patch.displayName, description: patch.description ?? "" };
    rows.set(id, updated);
    return simulateLatency(updated);
  },
};
