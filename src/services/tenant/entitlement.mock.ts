import { simulateLatency } from "@/shared/lib/mock/simulateLatency";

/**
 * Mock tenant root permission entitlement — stands in for a future `GET /tenant/entitlements`
 * -style endpoint, since no WCM backend exists yet (see docs/plan.md §15). Deliberately excludes
 * `website:manage`/`settings:manage` from the entitled set, simulating a package tier that hasn't
 * purchased those two capabilities. `role-admin` (see `assignment.mock.ts`) already holds all 16
 * catalog permission ids, so this immediately demonstrates "assigned but currently unavailable"
 * for anyone holding that role or a position/user with those two permissions granted directly —
 * no extra seed changes needed.
 *
 * Permission ids are plain string literals, not imported from
 * `features/access-control/wcm-permissions.ts` — `services/` is the mock-backend layer and must
 * not depend on `features/` (the adapter layer that consumes it), matching every other
 * `services/*.mock.ts` in this app. Keep in sync with `wcmPermissionDefinitions` by hand.
 */
const ENTITLED_PERMISSION_IDS: string[] = [
  "content:view",
  "content:manage",
  "catalog:view",
  "catalog:manage",
  "media:view",
  "media:manage",
  "website:view",
  "settings:view",
  "permission:view",
  "permission:manage",
  "role:view",
  "role:manage",
  "position:view",
  "position:manage",
];

export async function getTenantEntitledPermissionIds(): Promise<string[]> {
  return simulateLatency([...ENTITLED_PERMISSION_IDS], 150, 350);
}
